import {
  OnQueueDrained,
  OnQueueError,
  OnQueueFailed,
  Processor,
} from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Job } from 'bull';
import { CHAT_GPTS_SYNC } from '../config/QUEUE_NAME';

@Processor(CHAT_GPTS_SYNC.name)
export class BullListener {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @OnQueueFailed()
  onFailed(job: Job, err: Error) {
    this.logger.error(
      `job %s of type $s with data %s failedReason %s`,
      job.id,
      job.name,
      job.data,
      job.failedReason,
    );
    if (err) {
      this.logger.error(err);
    }
  }

  @OnQueueDrained()
  onDrained() {
    this.logger.info('jobs finish');
  }

  @OnQueueError()
  onError(error: Error) {
    this.logger.error(error);
  }
}
