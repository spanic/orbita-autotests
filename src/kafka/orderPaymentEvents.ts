import { Partitioners, Producer } from "kafkajs";
import { kafka } from "./client";

const ORDER_PAYMENT_REQUESTED_TOPIC = "order-payment-requested";

export interface OrderPaymentRequestedEvent {
  event_id: string;
  order_id: string;
  user_id: string;
  amount: number;
  occurred_at: string;
}

export async function createOrderPaymentProducer(): Promise<Producer> {
  const producer = kafka.producer({
    createPartitioner: Partitioners.DefaultPartitioner,
  });
  await producer.connect();
  return producer;
}

export async function sendOrderPaymentRequested(
  producer: Producer,
  event: OrderPaymentRequestedEvent,
) {
  await producer.send({
    topic: ORDER_PAYMENT_REQUESTED_TOPIC,
    messages: [{ key: event.order_id, value: JSON.stringify(event) }],
  });
}
