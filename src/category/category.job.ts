import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CategoryService } from './category.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { isDev } from '../utils/env';

@Injectable()
export class CategoryJob {
  constructor(
    private categoryService: CategoryService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  runSyncGpt() {
    if (isDev()) return;

    this.categoryService.runSyncGpt().catch(this.logger.error);
  }
}
