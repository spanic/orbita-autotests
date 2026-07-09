import { faker } from "@faker-js/faker";
import { expect, it } from "@jest/globals";
import { step } from "allure-js-commons";
import { DEFAULT_PROCESSING_DELAY_MS } from "../src/api/http";
import { getAccountBalance } from "../src/api/payments";
import { placeArchiveOrderStep } from "../src/steps/orders";
import { createAccountStep, topUpAccountStep } from "../src/steps/payments";

const TOP_UP_AMOUNT = 1000;

it(
  "Баланс аккаунта корректно обновляется после списания средств за заказ",
  async () => {
    const userId = faker.string.uuid();

    await createAccountStep(userId);
    await topUpAccountStep(userId, TOP_UP_AMOUNT);

    const order = await placeArchiveOrderStep(userId);

    await step("Проверить баланс аккаунта после списания средств", async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, DEFAULT_PROCESSING_DELAY_MS),
      );

      const response = await getAccountBalance(userId);

      expect(response.status).toBe(200);
      expect(response.data.balance).toBe(TOP_UP_AMOUNT - order.price);
    });
  },
  DEFAULT_PROCESSING_DELAY_MS + 5000,
);
