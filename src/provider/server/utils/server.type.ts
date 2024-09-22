export type HttpGetRequest = {
  path?: string;
  config?: Record<string, any>;
};

export type HttpPostRequest = {
  path?: string;
  data?: Record<string, any>;
  config?: Record<string, any>;
};

export type HttpPutRequest = {
  path?: string;
  data?: Record<string, any>;
  config?: Record<string, any>;
};

export type HttpDeleteRequest = {
  path?: string;
  config?: Record<string, any>;
};
