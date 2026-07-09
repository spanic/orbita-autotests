import { faker } from "@faker-js/faker";
import { expect, it } from "@jest/globals";
import { step } from "allure-js-commons";
import { DEFAULT_PROCESSING_DELAY_MS } from "../src/api/http";
import { getAccountBalance } from "../src/api/payments";
import {
  createOrderPaymentProducer,
  sendOrderPaymentRequested,
} from "../src/kafka/orderPaymentEvents";
import { placeArchiveOrderStep } from "../src/steps/orders";
import { createAccountStep, topUpAccountStep } from "../src/steps/payments";

const TOP_UP_AMOUNT = 1000;

it(
  "balance is debited only once when the same order_id is requested twice",
  async () => {
    const userId = faker.string.uuid();

    await createAccountStep(userId);
    await topUpAccountStep(userId, TOP_UP_AMOUNT);

    const order = await placeArchiveOrderStep(userId);

    await step(
      "Send OrderPaymentRequested twice with the same order_id",
      async () => {
        const producer = await createOrderPaymentProducer();

        try {
          await sendOrderPaymentRequested(producer, {
            event_id: faker.string.uuid(),
            order_id: order.id,
            user_id: userId,
            amount: order.price,
            occurred_at: new Date().toISOString(),
          });
        } finally {
          await producer.disconnect();
        }
      },
    );

    await step("Validate balance was debited only once", async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, DEFAULT_PROCESSING_DELAY_MS),
      );

      const response = await getAccountBalance(userId);

      expect(response.status).toBe(200);
      expect(response.data.balance).toBe(TOP_UP_AMOUNT - order.price);
    });
  },
  DEFAULT_PROCESSING_DELAY_MS + 10000,
);
