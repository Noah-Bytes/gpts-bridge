import { Inject, Injectable } from '@nestjs/common';
import { gizmo_metrics as GizmoMetricsModel, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import * as dayjs from 'dayjs';
import { PageGizmoMetricsDto } from './dto/page-gizmo-metrics.dto';
import { paginate } from '../utils/page';
import { ChatOpenaiService } from '../chat-openai/chat-openai.service';
import { Gpt } from '../chat-openai/dto/gpt.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { TopGizmosMetricsDto } from './dto/get-gizmo-metrics.dto';
import { GizmosService } from '../gizmos/gizmos.service';
import { keyBy } from 'lodash';
import { YYYYMMDD } from '../utils/date';
import { getNumConversationsStr } from '../utils/format';
import { gizmo as GizmoModule } from '.prisma/client';
import { GizmoStatus } from '../enums/GizmoStatus';
import { setTimeout } from 'node:timers/promises';
import { CHAT_GPTS_SYNC } from '../config/QUEUE_NAME';

@Injectable()
export class GizmoMetricsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly chatOpenaiService: ChatOpenaiService,
    private readonly gizmosService: GizmosService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async createYesterdayByGpt(gpt: Gpt) {
    const yesterday = dayjs().subtract(1, 'days').format(YYYYMMDD);
    let gizmoMetrics = this.formatByGpt(gpt, yesterday);
    const item = await this.findOne(gizmoMetrics.gizmo_id, yesterday);
    if (!item) {
      /**
       * 如果 num_conversations_str 不存在，则调用一次 gpt单个接口
       */
      if (gizmoMetrics.num_conversations_str === undefined) {
        this.logger.info(
          '【gpt数据】数据不存在，通过shorUrl: %s, 获取gpt详情',
          gpt.gizmo.short_url,
        );
        const gptByApi = await this.chatOpenaiService.getGizmosByShorUrl(
          gpt.gizmo.short_url,
        );
        gizmoMetrics = this.formatByGpt(gptByApi, yesterday);
      }

      // 如果单独获取gpt信息，则根据情况，更新回话数
      await this.gizmosService.setConversations(
        gizmoMetrics.gizmo_id,
        BigInt(gizmoMetrics.num_conversations_str),
      );
      await this.prismaService.gizmo_metrics.create({
        data: gizmoMetrics,
      });
    }
  }

  async createByGpt(gpt: Gpt, date: string) {
    const gizmoMetrics = this.formatByGpt(gpt, date);

    // 如果单独获取gpt信息，则根据情况，更新回话数
    if (gizmoMetrics.num_conversations_str !== undefined) {
      await this.gizmosService.setConversations(
        gizmoMetrics.gizmo_id,
        BigInt(gizmoMetrics.num_conversations_str),
      );
    }

    await this.prismaService.gizmo_metrics.create({
      data: gizmoMetrics,
    });
  }

  findOne(gizmo_id: string, date: string) {
    return this.prismaService.gizmo_metrics.findFirst({
      where: {
        gizmo_id,
        date,
      },
    });
  }

  findIn(gizmoIds: string[], date: string) {
    return this.prismaService.gizmo_metrics.findMany({
      where: {
        gizmo_id: {
          in: gizmoIds,
        },
        date,
      },
    });
  }

  page(params: PageGizmoMetricsDto) {
    return paginate(
      this.prismaService.gizmo_metrics,
      {
        where: {
          user_id: params.userId,
          gizmo_id: params.gizmoId,
          date: {
            gte: params.startDate,
            lte: params.endDate,
          },
        },
        orderBy: {
          date: Prisma.SortOrder.desc,
        },
      },
      {
        page: params.pageNo,
        perPage: params.pageSize,
      },
    );
  }

  formatByGpt(gpt: Gpt, date: string): GizmoMetricsModel {
    const { vanity_metrics, author, id } = gpt.gizmo;
    const num = getNumConversationsStr(vanity_metrics.num_conversations_str);
    // @ts-ignore
    return {
      user_id: author?.user_id,
      gizmo_id: id,
      num_conversations_str: isNaN(num) ? undefined : num,
      date,
    };
  }

  async top(params: TopGizmosMetricsDto) {
    const list = await this.prismaService.gizmo_metrics.findMany({
      where: {
        date: dayjs().subtract(1, 'days').format(YYYYMMDD),
      },
      orderBy: {
        num_conversations_str: Prisma.SortOrder.desc,
      },
      take: params.limit,
    });

    if (list.length === 0) {
      await this.createTop1000();
      return [];
    }

    const gizmosList = await this.gizmosService.findByIds(
      list.map((elem) => elem.gizmo_id),
    );

    const gizmosMap = keyBy(gizmosList, 'id');

    return list.map((elem) => ({
      ...elem,
      gizmos: gizmosMap[elem.gizmo_id],
    }));
  }

  async createByGizmos(item: GizmoModule, date: string) {
    if (item.status === GizmoStatus.DELETED) {
      // 跳过已删除的 gizmo
      return false;
    }

    const metrics = await this.findOne(item.id, date);

    if (metrics) {
      // 跳过 昨日数据已经存在 gizmo
      return false;
    }

    try {
      const gpt = await this.chatOpenaiService.getGizmosByShorUrl(
        item.short_url,
      );
      await this.gizmosService.upsertByGpt(gpt);
      await this.createByGpt(gpt, date);
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

  async createTop1000() {
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
}
