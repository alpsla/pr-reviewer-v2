type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

interface MockResponse {
  data: JSONValue;
  status: number;
  headers: HeadersInit;
  json: () => Promise<JSONValue>;
}

class MockNextResponse {
  static json(data: JSONValue, init?: ResponseInit): MockResponse {
    return {
      data,
      status: init?.status || 200,
      headers: init?.headers || {},
      json: () => Promise.resolve(data),
    };
  }
}

interface GlobalWithNextResponse {
  NextResponse: typeof MockNextResponse;
  Response: {
    json: (data: JSONValue) => {
      data: JSONValue;
      json: () => Promise<JSONValue>;
    };
  };
}

declare const global: GlobalWithNextResponse;

global.NextResponse = MockNextResponse;
global.Response = {
  json: (data: JSONValue) => ({
    data,
    json: () => Promise.resolve(data),
  }),
};

export { MockNextResponse as NextResponse };
