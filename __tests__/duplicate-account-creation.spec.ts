import { faker } from "@faker-js/faker";
import { expect, it } from "@jest/globals";
import { step } from "allure-js-commons";
import { createAccount, ErrorResponse } from "../src/api/payments";
import { createAccountStep, topUpAccountStep } from "../src/steps/payments";

const TOP_UP_AMOUNT = 100;

it("Не создается дубликат аккаунта для пользователя", async () => {
  const userId = faker.string.uuid();

  await createAccountStep(userId);
  await topUpAccountStep(userId, TOP_UP_AMOUNT);

  await step(
    "Попытаться создать аккаунт повторно для того же пользователя",
    async () => {
      const response = await createAccount(userId);
      const body = response.data as unknown as ErrorResponse;

      expect(response.status).toBe(409);
      expect(body.error_code).toBe("ACCOUNT_ALREADY_EXISTS");
      expect(body.message).toBe("Account already exists for this user");
    },
  );
});
