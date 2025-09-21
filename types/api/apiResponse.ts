export interface ApiResponse<T> {
  status: boolean;
  code: number;
  message: string;
  timestamp: string;
  data?: T;
  path?: string;
}
