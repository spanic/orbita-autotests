import { faker } from "@faker-js/faker";
import { expect } from "@jest/globals";
import { step } from "allure-js-commons";
import { createArchiveOrder, Order, SensorType } from "../api/orders";

export function placeArchiveOrder(userId: string) {
  return createArchiveOrder(userId, {
    aoi: faker.location.country(),
    capture_date: faker.date.recent().toISOString(),
    sensor_type: SensorType.INFRARED,
  });
}

export async function placeArchiveOrderStep(userId: string): Promise<Order> {
  return step("Place an archive order", async () => {
    const response = await placeArchiveOrder(userId);

    expect(response.status).toBe(201);
    expect(response.data.price).toBeGreaterThan(0);

    return response.data;
  });
}
