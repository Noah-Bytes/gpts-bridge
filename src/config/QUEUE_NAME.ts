import { CronExpression } from '@nestjs/schedule';

export const CHAT_GPTS_SYNC = {
  name: 'chat_gpts_sync',
  jobs: {
    category: {
      name: 'category_job',
      repeatCron: '0 0 * * *',
      delay: {
        success: 1000 * 2,
        exception: 1000 * 60,
      },
    },
    userId: {
      name: 'userId_job',
      repeatCron: '0 6 * * *',
      delay: {
        success: 1000 * 2,
        exception: 1000 * 30,
      },
    },
    query: {
      name: 'query_job',
      repeatCron: '20 0 * * *',
      delay: {
        success: 1000 * 5,
        exception: 1000 * 60,
      },
    },
    repair: {
      name: 'repair_job',
      // 每天中午12点。
      repeatCron: CronExpression.EVERY_DAY_AT_NOON,
      delay: {
        success: 1000,
        exception: 1000 * 60,
      },
    },
  },
};
