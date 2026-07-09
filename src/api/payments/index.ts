import { httpClient, userIdHeaders } from "../http";
import { Account, Balance } from "./types";

export * from "./types";

const PAYMENTS_PREFIX = "/payments";
const ACCOUNTS_PATH = `${PAYMENTS_PREFIX}/accounts`;
const TOP_UP_PATH = `${ACCOUNTS_PATH}/top-up`;
const BALANCE_PATH = `${ACCOUNTS_PATH}/balance`;

export async function createAccount(userId: string) {
  return httpClient.post<Account>(ACCOUNTS_PATH, {}, userIdHeaders(userId));
}

export async function topUpAccount(userId: string, amount: number) {
  return httpClient.post<Balance>(
    TOP_UP_PATH,
    { amount },
    userIdHeaders(userId),
  );
}

export async function getAccountBalance(userId: string) {
  return httpClient.get<Balance>(BALANCE_PATH, userIdHeaders(userId));
}
