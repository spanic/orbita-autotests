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
  "order is rejected and balance stays unchanged when balance is insufficient",
  async () => {
    const userId = faker.string.uuid();

    await createAccountStep(userId);
    await topUpAccountStep(userId, TOP_UP_AMOUNT);

    const orderId = await step(
      "Place an archive order priced above the account balance",
      async () => {
        const response = await placeArchiveOrder(userId);

        expect(response.status).toBe(201);
        expect(response.data.price).toBeGreaterThan(TOP_UP_AMOUNT);
        expect(response.data.status).toBe(OrderStatus.PAYMENT_PENDING);

        return response.data.id;
      },
    );

    await step("Validate order payment fails", async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, DEFAULT_PROCESSING_DELAY_MS),
      );

      const response = await getOrder(userId, orderId);

      expect(response.status).toBe(200);
      expect(response.data.failure_reason).toBe("INSUFFICIENT_BALANCE");
    });

    await step("Validate account balance remains unchanged", async () => {
      const response = await getAccountBalance(userId);

      expect(response.status).toBe(200);
      expect(response.data.balance).toBe(TOP_UP_AMOUNT);
    });
  },
  DEFAULT_PROCESSING_DELAY_MS + 5000,
);
