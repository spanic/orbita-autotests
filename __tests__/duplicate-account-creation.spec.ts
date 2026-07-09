import { faker } from "@faker-js/faker";
import { expect, it } from "@jest/globals";
import { step } from "allure-js-commons";
import { createAccount, ErrorResponse, getAccountBalance } from "../src/api/payments";
import { createAccountStep, topUpAccountStep } from "../src/steps/payments";

const TOP_UP_AMOUNT = 100;

it("does not create a duplicate account for the same user id", async () => {
  const userId = faker.string.uuid();

  await createAccountStep(userId);
  await topUpAccountStep(userId, TOP_UP_AMOUNT);

  await step(
    "Attempt to create the account again for the same user id",
    async () => {
      const response = await createAccount(userId);
      const body = response.data as unknown as ErrorResponse;

      expect(response.status).toBe(409);
      expect(body.error_code).toBe("ACCOUNT_ALREADY_EXISTS");
      expect(body.message).toBe("Account already exists for this user");
    },
  );

  await step("Validate the original account balance is untouched", async () => {
    const response = await getAccountBalance(userId);

    expect(response.status).toBe(200);
    expect(response.data.balance).toBe(TOP_UP_AMOUNT);
  });
});
