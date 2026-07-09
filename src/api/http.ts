import axios from "axios";

const baseURL = process.env.ORBITA_BASE_URL ?? "http://localhost:8080";

export const DEFAULT_PROCESSING_DELAY_MS = 3000;

export const httpClient = axios.create({
  baseURL,
  validateStatus: () => true,
});

export function userIdHeaders(userId: string) {
  return { headers: { "X-User-Id": userId } };
}
