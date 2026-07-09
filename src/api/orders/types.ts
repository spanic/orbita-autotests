export interface ArchiveOrderPayload {
  aoi: string;
  capture_date: string;
  sensor_type: SensorType;
}

export interface Order {
  id: string;
  user_id: string;
  type: OrderType;
  aoi: string;
  price: number;
  capture_date: string;
  sensor_type: SensorType;
  created_at: string;
  status: OrderStatus;
  failure_reason?: string;
}

export enum OrderType {
  ARCHIVE = "ARCHIVE",
  TASKING = "TASKING",
  MONITORING = "MONITORING",
}

export enum SensorType {
  INFRARED = "INFRARED",
  VISIBLE = "VISIBLE",
  MICROWAVE = "MICROWAVE",
  RADAR = "RADAR",
  OTHER = "OTHER",
}

export enum OrderStatus {
  PAYMENT_PENDING = "PAYMENT_PENDING",
  PAID = "PAID",
  PAYMENT_FAILED = "PAYMENT_FAILED",
}
