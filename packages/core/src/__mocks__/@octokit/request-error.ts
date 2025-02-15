export class RequestError extends Error {
  status: number;
  response?: {
    status: number;
    url: string;
    headers: Record<string, string>;
    data: Record<string, unknown>;
  };
  request: {
    method: string;
    url: string;
    headers: Record<string, string>;
  };

  constructor(
    message: string,
    status: number = 500,
    request = { method: "GET", url: "", headers: {} },
  ) {
    super(message);
    this.name = "RequestError";
    this.status = status;
    this.request = request;
  }
}
