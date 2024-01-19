import { Inject, Injectable } from '@nestjs/common';
import { ChatOpenaiService } from '../chat-openai/chat-openai.service';
import { AuthorService } from '../author/author.service';
import { GizmosService } from '../gizmos/gizmos.service';
import { GizmoMetricsService } from '../gizmo-metrics/gizmo-metrics.service';
import { InjectQueue } from '@nestjs/bull';
import { CHAT_GPTS_SYNC } from '../config/QUEUE_NAME';
import { Queue } from 'bull';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class GizmoSearchService {
  constructor(
    private chatOpenaiService: ChatOpenaiService,
    private authorService: AuthorService,
    private gizmosService: GizmosService,
    private gizmoMetricsService: GizmoMetricsService,
    @InjectQueue(CHAT_GPTS_SYNC.name) private readonly gtpSyncQueue: Queue,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async syncByQuery(query: string) {
    this.logger.info('【搜索维度同步】开始同步 %s', query);
    const { items } = await this.chatOpenaiService.getGizmosByQuery(query);
    this.logger.info(
      '【搜索维度同步】搜索词：%s 同步到 %s 个 gpt',
      query,
      items.length,
    );
    for (let i = 0; i < items.length; i++) {
      const gpt = items[i];
      // 更新用户信息并且提交任务
      await this.authorService.upsertByGpt(gpt);
      await this.authorService.createQueueTask(gpt.gizmo.author.user_id);

      await this.gizmosService.upsertByGpt(gpt);
      await this.gizmoMetricsService.createByGpt(gpt);
    }
  }

  async createQueueTask(query: string) {
    await this.gtpSyncQueue.add(
      CHAT_GPTS_SYNC.jobs.query,
      {
        query,
      },
      {
        jobId: query,
      },
    );
  }
}
