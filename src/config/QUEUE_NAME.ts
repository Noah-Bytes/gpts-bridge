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
      repeatCron: '0 1 * * *',
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
      // 每天的凌晨5点、上午7点、中午11点、下午3点和晚上7点各执行一次。
      repeatCron: '0 5-23/2 * * *',
      delay: {
        success: 1000,
        exception: 1000 * 60,
      },
    },
  },
};
