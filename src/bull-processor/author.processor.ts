import { Process, Processor } from '@nestjs/bull';
import { CHAT_GPTS_SYNC } from '../config/QUEUE_NAME';
import { Job } from 'bull';
import { ChatOpenaiService } from '../chat-openai/chat-openai.service';
import { GizmosService } from '../gizmos/gizmos.service';
import { GizmoMetricsService } from '../gizmo-metrics/gizmo-metrics.service';
import { GizmoSearchService } from '../gizmo-search/gizmo-search.service';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AuthorService } from '../author/author.service';
import { setTimeout } from 'node:timers/promises';

@Processor(CHAT_GPTS_SYNC.name)
export class AuthorProcessor {
  constructor(
    private chatOpenaiService: ChatOpenaiService,
    private authorService: AuthorService,
    private gizmosService: GizmosService,
    private gizmoMetricsService: GizmoMetricsService,
    private gizmoSearchService: GizmoSearchService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Process(CHAT_GPTS_SYNC.jobs.userId)
  async handleGPTsByUserIdOnJob(job: Job) {
    const { userId } = job.data;
    try {
      await this.syncGPTsByUserId(userId);
      await setTimeout(CHAT_GPTS_SYNC.jobs.userId.delay.success);
    } catch (e) {
      await setTimeout(CHAT_GPTS_SYNC.jobs.userId.delay.exception);
      throw e;
    }
  }
  async syncGPTsByUserId(userId: string) {
    this.logger.info('【用户维度同步】开始同步%s', userId);
    const { items } = await this.chatOpenaiService.getGizmosByUser(userId);
    this.logger.info(
      '【用户维度同步】 userId: %s 同步到 %s 个 gpt',
      userId,
      items.length,
    );

    for (let i = 0; i < items.length; i++) {
      const gpt = items[i];
      // 更新gpt信息
      await this.gizmosService.upsertByGpt(gpt);
      // 更新数据
      await this.gizmoMetricsService.createYesterdayByGpt(gpt);

      // 创建搜索任务
      await this.gizmoSearchService.createQueueTask(gpt.gizmo.display.name);
    }

    const totalCount = await this.authorService.count({
      user_id: userId,
    });

    // 更新作者，无需更新
    await this.authorService.update(userId, {
      gpt_total: totalCount,
    });

    return true;
  }
}
