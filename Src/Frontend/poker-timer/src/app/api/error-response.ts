export interface IErrorResponse {
  code: number;
  message: string;
}

export function isErrorResponse(error: any): error is IErrorResponse {
  return error && typeof error.code === "number" && typeof error.message === "string";
}
