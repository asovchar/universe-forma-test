import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export default registerAs('auth', () => ({
  jwt: {
    secret: process.env.JWT_SECRET!,
    ttl: parseInt(process.env.ACCESS_TOKEN_TTL || '3600', 10),
  },
}));
