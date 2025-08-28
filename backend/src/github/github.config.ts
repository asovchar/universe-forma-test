import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export default registerAs('github', () => ({
  baseUrl: process.env.GITHUB_BASE_URL ?? 'https://api.github.com',
}));
