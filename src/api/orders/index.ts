import { httpClient, userIdHeaders } from "../http";
import { ArchiveOrderPayload, Order, OrderType } from "./types";

export * from "./types";

const ORDERS_PREFIX = "/orders";
const ORDERS_PATH = `${ORDERS_PREFIX}/orders`;

export async function createArchiveOrder(
  userId: string,
  payload: ArchiveOrderPayload,
) {
  return httpClient.post<Order>(
    ORDERS_PATH,
    { type: OrderType.ARCHIVE, payload },
    userIdHeaders(userId),
  );
}

export async function getOrder(userId: string, orderId: string) {
  return httpClient.get<Order>(
    `${ORDERS_PATH}/${orderId}`,
    userIdHeaders(userId),
  );
}
