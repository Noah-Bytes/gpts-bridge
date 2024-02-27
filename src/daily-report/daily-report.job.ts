import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as dayjs from 'dayjs';
import { YYYYMMDD } from '../utils/date';
import { DailyReportService } from './daily-report.service';
import { isDev } from '../utils/env';

@Injectable()
export class DailyReportJob {
  constructor(
    private readonly dailyReportService: DailyReportService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  /**
   * 每小时计算一次当日数据，因为数据还在增加中，每日1点开始
   */
  @Cron('0 1-23/1 * * *')
  async current() {
    if (isDev()) return;

    const currentDay = dayjs().format(YYYYMMDD);
    await this.dailyReportService.statisticsGpt(currentDay);
  }

  /**
   * 每日凌晨计算近30天数据
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async history() {
    const days = [];
    for (let i = 1; i <= 30; i++) {
      days.push(dayjs().subtract(i, 'days').format(YYYYMMDD));
    }

    for (let i = 0; i < days.length; i++) {
      await this.dailyReportService.statisticsGpt(days[i]);
    }
  }
}
