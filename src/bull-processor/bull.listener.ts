import { OnQueueFailed, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Job } from 'bull';

@Processor()
export class BullListener {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @OnQueueFailed()
  onFailed(job: Job) {
    this.logger.error(
      `job %s of type $s with data %s failedReason %s`,
      job.id,
      job.name,
      job.data,
      job.failedReason,
    );
  }
}
