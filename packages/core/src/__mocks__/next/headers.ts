export function cookies() {
  return {
    get: jest.fn(),
  };
}

export function headers() {
  return new Headers();
}
