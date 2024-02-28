import { GizmoMetricsService } from './gizmo-metrics.service';
import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GizmosService } from '../gizmos/gizmos.service';
import * as dayjs from 'dayjs';
import { YYYYMMDD } from '../utils/date';
import { ChatOpenaiService } from '../chat-openai/chat-openai.service';
import { GizmoStatus } from '../enums/GizmoStatus';
import { CHAT_GPTS_SYNC } from '../config/QUEUE_NAME';
import { setTimeout } from 'node:timers/promises';
import { isDev } from '../utils/env';
import { Prisma } from '@prisma/client';
import { gizmo as GizmoModule } from '@prisma/client';

@Injectable()
export class GizmoMetricsJob {
  constructor(
    private readonly gizmoMetricsService: GizmoMetricsService,
    private readonly gizmosService: GizmosService,
    private readonly chatOpenaiService: ChatOpenaiService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async createByGizmos(item: GizmoModule, date: string) {
    if (item.status === GizmoStatus.DELETED) {
      // 跳过已删除的 gizmo
      return false;
    }

    const metrics = await this.gizmoMetricsService.findOne(item.id, date);

    if (metrics) {
      // 跳过 昨日数据已经存在 gizmo
      return false;
    }

    try {
      const gpt = await this.chatOpenaiService.getGizmosByShorUrl(
        item.short_url,
      );
      await this.gizmosService.upsertByGpt(gpt);
      await this.gizmoMetricsService.createByGpt(gpt, date);
      await setTimeout(CHAT_GPTS_SYNC.jobs.repair.delay.success);
      return true;
    } catch (e) {
      this.logger.error(e, e.message);
      if (e.message.indexOf('status code 404') > -1) {
        await this.gizmosService.update(item.id, {
          status: GizmoStatus.DELETED,
        });
        return false;
      }
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async top1000() {
    const page = await this.gizmosService.page({
      pageNo: 1,
      pageSize: 1000,
      orderBy: {
        conversations: Prisma.SortOrder.desc,
      },
    });

    const date = dayjs().subtract(1, 'days').format(YYYYMMDD);

    for (let i = 0; i < page.data.length; i++) {
      const temp = page.data[i];
      await this.createByGizmos(temp, date);
    }
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

        const result = await this.createByGizmos(temp, date);

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
