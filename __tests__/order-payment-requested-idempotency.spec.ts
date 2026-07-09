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
  "Баланс корректно обновляется только один раз при повторной отправке события OrderPaymentRequested",
  async () => {
    const userId = faker.string.uuid();

    await createAccountStep(userId);
    await topUpAccountStep(userId, TOP_UP_AMOUNT);

    const order = await placeArchiveOrderStep(userId);

    await step(
      "Отправить событие OrderPaymentRequested снова с тем же order_id",
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

    await step("Проверить, что баланс был списан только один раз", async () => {
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
