import { registerAs } from '@nestjs/config';

export const ttlConfig = registerAs('ttl', () => ({
  ttl: process.env.THROTTLE_TTL,
  limit: process.env.THROTTLE_LIMIT,
}));
