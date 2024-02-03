import { Inject, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { CHAT_GPTS_SYNC } from '../config/QUEUE_NAME';
import { Queue } from 'bull';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class GizmoSearchService {
  constructor(
    @InjectQueue(CHAT_GPTS_SYNC.name) private readonly gtpSyncQueue: Queue,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async createQueueTask(query: string) {
    await this.gtpSyncQueue.add(
      CHAT_GPTS_SYNC.jobs.query.name,
      {
        query,
      },
      {
        jobId: query,
        repeat: {
          cron: CHAT_GPTS_SYNC.jobs.query.repeatCron,
        },
      },
    );
  }
}
