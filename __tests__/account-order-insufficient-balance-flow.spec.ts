import { faker } from "@faker-js/faker";
import { expect, it } from "@jest/globals";
import { step } from "allure-js-commons";
import { DEFAULT_PROCESSING_DELAY_MS } from "../src/api/http";
import { getOrder, OrderStatus } from "../src/api/orders";
import { getAccountBalance } from "../src/api/payments";
import { placeArchiveOrder } from "../src/steps/orders";
import { createAccountStep, topUpAccountStep } from "../src/steps/payments";

const TOP_UP_AMOUNT = 50;

it(
  "Заказ отклоняется и баланс остается неизменным, когда средств недостаточно",
  async () => {
    const userId = faker.string.uuid();

    await createAccountStep(userId);
    await topUpAccountStep(userId, TOP_UP_AMOUNT);

    const orderId = await step(
      "Разместить заказ на архивный снимок, цена которого превышает текущийбаланс аккаунта",
      async () => {
        const response = await placeArchiveOrder(userId);

        expect(response.status).toBe(201);
        expect(response.data.price).toBeGreaterThan(TOP_UP_AMOUNT);
        expect(response.data.status).toBe(OrderStatus.PAYMENT_PENDING);

        return response.data.id;
      },
    );

    await step("Проверить, что заказ не был оплачен", async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, DEFAULT_PROCESSING_DELAY_MS),
      );

      const response = await getOrder(userId, orderId);

      expect(response.status).toBe(200);
      expect(response.data.failure_reason).toBe("INSUFFICIENT_BALANCE");
    });

    await step(
      "Проверить, что баланс аккаунта остался неизменным",
      async () => {
        const response = await getAccountBalance(userId);

        expect(response.status).toBe(200);
        expect(response.data.balance).toBe(TOP_UP_AMOUNT);
      },
    );
  },
  DEFAULT_PROCESSING_DELAY_MS + 5000,
);
