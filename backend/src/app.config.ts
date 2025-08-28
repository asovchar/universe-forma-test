import * as process from 'node:process';

export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || '127.0.0.1',
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/db',
  },
  bull: {
    redis: {
      url: process.env.REDIS_URL || 'redis://localhost:6379/0',
    },
  },
});
