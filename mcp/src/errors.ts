export class WatermelonAuthError extends Error {
  constructor(message = "Invalid or expired API key") {
    super(message);
    this.name = "WatermelonAuthError";
  }
}

export class WatermelonApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: string,
  ) {
    super(`Watermelon API error ${status}: ${body}`);
    this.name = "WatermelonApiError";
  }
}

export class WatermelonNetworkError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "WatermelonNetworkError";
  }
}
