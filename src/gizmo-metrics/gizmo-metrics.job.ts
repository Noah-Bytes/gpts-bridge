import { GizmoMetricsService } from './gizmo-metrics.service';
import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GizmosService } from '../gizmos/gizmos.service';
import * as dayjs from 'dayjs';
import { YYYYMMDD } from '../utils/date';
import { CHAT_GPTS_SYNC } from '../config/QUEUE_NAME';
import { isDev } from '../utils/env';

@Injectable()
export class GizmoMetricsJob {
  constructor(
    private readonly gizmoMetricsService: GizmoMetricsService,
    private readonly gizmosService: GizmosService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async top1000() {
    await this.gizmoMetricsService.createTop1000();
  }

  /**
   * 补漏逻辑
   * 每天中午12点
   */
  @Cron(CHAT_GPTS_SYNC.jobs.repair.repeatCron)
  async repair() {
    if (isDev()) return;

    let pageNo = 1,
      total = 0,
      hadTotal = 0,
      hadUpdateTotal = 0;

    const pageSize = 1000;
    const date = dayjs().subtract(1, 'days').format(YYYYMMDD);

    do {
      const page = await this.gizmosService.page({
        pageNo,
        pageSize,
      });

      if (page.data.length === 0) {
        break;
      }

      for (let i = 0; i < page.data.length; i++) {
        const temp = page.data[i];

        const result = await this.gizmoMetricsService.createByGizmos(
          temp,
          date,
        );

        if (result) {
          hadUpdateTotal++;
        }
      }

      hadTotal += page.data.length;
      total = page.meta.total;

      this.logger.info(
        '检测gpts是否今日更新，总共%s个，已检查%s个，当前第%s页，已补漏%s个',
        total,
        hadTotal,
        pageNo,
        hadUpdateTotal,
      );

      pageNo++;
    } while (hadTotal < total);
  }
}
