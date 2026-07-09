export interface Account {
  id: string;
  user_id: string;
  balance: number;
  created_at: string;
  version: number;
}

export interface Balance {
  balance: number;
}

export interface ErrorResponse {
  timestamp: string;
  error_code: string;
  message: string;
}
