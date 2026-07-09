import { ISocketFactoryArgs, Kafka } from "kafkajs";
import net from "net";

const brokers = (process.env.KAFKA_BROKERS ?? "localhost:9092").split(",");

function socketFactory({ host, port, onConnect }: ISocketFactoryArgs) {
  const resolvedHost = host === "kafka" ? "localhost" : host;
  const socket = net.connect({ host: resolvedHost, port });

  socket.on("connect", onConnect);

  return socket;
}

export const kafka = new Kafka({
  clientId: "orbita-autotests",
  brokers,
  socketFactory,
});
