export class AppError extends Error {
  constructor(message: string, public innerError?: Error) {
    super(message);
    //Error["stackTraceLimit"] = 500;
    //Error.captureStackTrace(this, AppError);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
