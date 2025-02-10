import { RequestError } from './request-error';

// interface OctokitOptions {
//   auth?: string;
//   baseUrl?: string;
//   userAgent?: string;
//   timeZone?: string;
// }

export class Octokit {
  rest: {
    pulls: {
      get: jest.Mock;
      list: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
    repos: {
      get: jest.Mock;
      list: jest.Mock;
    };
    users: {
      getAuthenticated: jest.Mock;
    };
  };

  pulls: {
    get: jest.Mock;
    list: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
  };

  constructor() {
    const pulls = {
      get: jest.fn().mockRejectedValue(new RequestError('Bad credentials', 401)),
      list: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    this.pulls = pulls;
    this.rest = {
      pulls,
      repos: {
        get: jest.fn(),
        list: jest.fn(),
      },
      users: {
        getAuthenticated: jest.fn(),
      },
    };
  }
}