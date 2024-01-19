import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CHAT_GPTS_SYNC } from '../config/QUEUE_NAME';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ChatOpenaiService } from '../chat-openai/chat-openai.service';
import { AuthorService } from '../author/author.service';
import { GizmoMetricsService } from '../gizmo-metrics/gizmo-metrics.service';
import { GizmosService } from '../gizmos/gizmos.service';
import { Gpt } from '../chat-openai/dto/gpt.dto';

@Injectable()
export class CategoryService {
  constructor(
    private prismaService: PrismaService,
    private chatOpenaiService: ChatOpenaiService,
    private authorService: AuthorService,
    private gizmoMetricsService: GizmoMetricsService,
    private gizmosService: GizmosService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectQueue(CHAT_GPTS_SYNC.name) private readonly gtpSyncQueue: Queue,
  ) {}

  findAll() {
    return this.prismaService.category.findMany();
  }

  findOne(id: string) {
    return this.prismaService.category.findFirst({
      where: {
        id,
      },
    });
  }

  /**
   * 根据类目同步
   * TODO 迁移
   * @param key
   */
  async syncByCategory(key: string) {
    let cursor = 0;
    const limit = 10;
    const gpts: Gpt[] = [];
    let lastResp;
    do {
      lastResp = await this.chatOpenaiService.getGizmosByCategory({
        key,
        cursor,
        limit,
      });

      if (!lastResp.list) {
        break;
      }

      if (!lastResp.list.items) {
        break;
      }

      this.logger.info(
        '【类目维度同步】 %s, cursor: %s 获取gpts个数 %s',
        key,
        cursor,
        lastResp.list.items.length,
      );

      cursor = lastResp.list.cursor;

      lastResp.list.items.forEach((elem: { resource: Gpt }) => {
        gpts.push(elem.resource);
      });
    } while (!!lastResp.list.cursor);

    this.logger.info(
      '【类目维度同步】 %s, 总共获取gpts个数 %s',
      key,
      gpts.length,
    );

    for (let i = 0; i < gpts.length; i++) {
      const gpt = gpts[i];
      // 更新作者并且创建userId任务
      await this.authorService.upsertByGpt(gpt);
      await this.authorService.createQueueTask(gpt.gizmo.author.user_id);

      // 更新gpt信息
      await this.gizmosService.upsertByGpt(gpt);

      // 更新数据
      await this.gizmoMetricsService.createByGpt(gpt);
    }
  }

  async runSyncGpt() {
    const list = await this.findAll();
    for (let i = 0; i < list.length; i++) {
      await this.gtpSyncQueue.add(
        CHAT_GPTS_SYNC.jobs.category,
        {
          key: list[i].key,
        },
        {
          jobId: list[i].key,
        },
      );
    }
  }
}
