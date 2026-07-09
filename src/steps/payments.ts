import { expect } from "@jest/globals";
import { step } from "allure-js-commons";
import { Account, Balance, createAccount, topUpAccount } from "../api/payments";

export async function createAccountStep(userId: string): Promise<Account> {
  return step("Create user account", async () => {
    const response = await createAccount(userId);

    expect(response.status).toBe(201);
    expect(response.data.user_id).toBe(userId);
    expect(response.data.balance).toBe(0);

    return response.data;
  });
}

export async function topUpAccountStep(
  userId: string,
  amount: number,
): Promise<Balance> {
  return step(`Top up account to ${amount}`, async () => {
    const response = await topUpAccount(userId, amount);

    expect(response.status).toBe(200);
    expect(response.data.balance).toBe(amount);

    return response.data;
  });
}
