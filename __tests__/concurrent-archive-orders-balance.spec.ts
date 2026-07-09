import { faker } from "@faker-js/faker";
import { expect, it } from "@jest/globals";
import { step } from "allure-js-commons";
import { DEFAULT_PROCESSING_DELAY_MS } from "../src/api/http";
import { getOrder, OrderStatus } from "../src/api/orders";
import { getAccountBalance } from "../src/api/payments";
import { placeArchiveOrder } from "../src/steps/orders";
import { createAccountStep, topUpAccountStep } from "../src/steps/payments";

const TOP_UP_AMOUNT = 1000;

it(
  "both concurrent orders are paid and balance reflects both withdrawals",
  async () => {
    const userId = faker.string.uuid();

    await createAccountStep(userId);
    await topUpAccountStep(userId, TOP_UP_AMOUNT);

    const orders = await step(
      "Place two concurrent archive orders",
      async () => {
        const [firstResponse, secondResponse] = await Promise.all([
          placeArchiveOrder(userId),
          placeArchiveOrder(userId),
        ]);

        expect(firstResponse.status).toBe(201);
        expect(firstResponse.data.status).toBe(OrderStatus.PAYMENT_PENDING);

        expect(secondResponse.status).toBe(201);
        expect(secondResponse.data.status).toBe(OrderStatus.PAYMENT_PENDING);

        return [firstResponse.data, secondResponse.data];
      },
    );

    await step("Validate both orders are paid", async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, DEFAULT_PROCESSING_DELAY_MS),
      );

      for (const order of orders) {
        const response = await getOrder(userId, order.id);

        expect(response.status).toBe(200);
        expect(response.data.status).toBe(OrderStatus.PAID);
      }
    });

    await step(
      "Validate account balance reflects both withdrawals",
      async () => {
        const totalPrice = orders.reduce((sum, order) => sum + order.price, 0);
        const response = await getAccountBalance(userId);

        expect(response.status).toBe(200);
        expect(response.data.balance).toBe(TOP_UP_AMOUNT - totalPrice);
      },
    );
  },
  DEFAULT_PROCESSING_DELAY_MS + 10000,
);
