import { Inject, Injectable } from '@nestjs/common';
import { CreateDailyReportDto } from './dto/create-daily-report.dto';
import { PrismaService } from '../prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import * as dayjs from 'dayjs';
import { YYYYMMDD } from '../utils/date';
import { GizmoStatus } from '../enums/GizmoStatus';
import { GizmosService } from '../gizmos/gizmos.service';
import {
  CATEGORY_CREATE_TYPE,
  GPT_CREATE_TYPE,
  LANGUAGE_CREATE_TYPE,
} from './enum/type.enum';
import { PageDailyReportDto } from './dto/page-daily-report.dto';
import { paginate } from '../utils/page';
import { Prisma } from '@prisma/client';

@Injectable()
export class DailyReportService {
  constructor(
    private readonly gizmosService: GizmosService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly prismaService: PrismaService,
  ) {}
  async create(createDailyReportDto: CreateDailyReportDto) {
    await this.prismaService.daily_report.create({
      data: {
        type: createDailyReportDto.type,
        subType: createDailyReportDto?.subType,
        value: createDailyReportDto.value,
        date: createDailyReportDto.date,
      },
    });
  }

  page(params: PageDailyReportDto) {
    return paginate(
      this.prismaService.daily_report,
      {
        where: {
          date: {
            gte: params.startDate,
            lte: params.endDate,
          },
          type: params.type,
          subType: params.subType,
        },
        orderBy: {
          date: Prisma.SortOrder.asc,
        },
      },
      {
        page: params.pageNo,
        perPage: params.pageSize,
      },
    );
  }

  async upsertByTypeAndDay(type: number, day: string, value: number) {
    const old = await this.prismaService.daily_report.findFirst({
      where: {
        type,
        date: day,
      },
    });

    if (old) {
      await this.prismaService.daily_report.update({
        where: {
          id: old.id,
        },
        data: {
          value,
        },
      });
    } else {
      await this.create({
        type,
        date: day,
        value,
      });
    }
  }

  async upsertByTypeSubTypeAndDay(
    type: number,
    subType: string,
    day: string,
    value: number,
  ) {
    const old = await this.prismaService.daily_report.findFirst({
      where: {
        type,
        subType,
        date: day,
      },
    });

    if (old) {
      await this.prismaService.daily_report.update({
        where: {
          id: old.id,
        },
        data: {
          value,
        },
      });
    } else {
      await this.create({
        type,
        subType,
        date: day,
        value,
      });
    }
  }

  async statisticsGpt(date: string) {
    let pageNo = 1,
      total = 0,
      hadTotal = 0;

    const pageSize = 1000;

    const category = {};
    const language = {};

    do {
      const page = await this.gizmosService.page({
        pageNo,
        pageSize,
        createStarDate: dayjs(date).startOf('day').toISOString(),
        createEndDate: dayjs(date).endOf('day').toISOString(),
      });

      if (page.data.length === 0) {
        break;
      }

      for (let i = 0; i < page.data.length; i++) {
        const temp = page.data[i];

        if (temp.status === GizmoStatus.DELETED) {
          // 跳过已删除的 gizmo
          continue;
        }

        if (!category[temp.categories]) {
          category[temp.categories] = 1;
        } else {
          category[temp.categories] += 1;
        }

        if (!language[temp.language]) {
          language[temp.language] = 1;
        } else {
          language[temp.language] += 1;
        }
      }

      hadTotal += page.data.length;
      total = page.meta.total;

      pageNo++;
    } while (hadTotal < total);

    const day = dayjs(date).format(YYYYMMDD);
    await this.upsertByTypeAndDay(GPT_CREATE_TYPE, day, total);

    for (const categoryKey in category) {
      await this.upsertByTypeSubTypeAndDay(
        CATEGORY_CREATE_TYPE,
        categoryKey,
        day,
        category[categoryKey],
      );
    }

    for (const languageKey in language) {
      await this.upsertByTypeSubTypeAndDay(
        LANGUAGE_CREATE_TYPE,
        languageKey,
        day,
        language[languageKey],
      );
    }
  }
}
