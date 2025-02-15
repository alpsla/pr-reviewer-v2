type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

export class NextRequest extends Request {
  constructor(input: RequestInfo, init?: RequestInit) {
    super(input, init);
  }
}

export class NextResponse extends Response {
  static json(data: JSONValue, init?: ResponseInit) {
    return new NextResponse(JSON.stringify(data), {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
  }
}
