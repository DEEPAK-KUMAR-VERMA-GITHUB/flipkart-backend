export const JWT_CONSTANTS = {
  ACCESS_TOKEN_EXPIRES_IN: '15m',
  REFRESH_TOKEN_EXPIRES_IN: '7d',
} as const;

export const API_CONSTANTS = {
  API_PREFIX: 'api',
  API_VERSION: 'v1',
} as const;

export const DATABASE_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;
