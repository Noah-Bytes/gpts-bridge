import { Process, Processor } from '@nestjs/bull';
import { CHAT_GPTS_SYNC } from '../config/QUEUE_NAME';
import { Job } from 'bull';
import { ChatOpenaiService } from '../chat-openai/chat-openai.service';
import { AuthorService } from '../author/author.service';
import { GizmosService } from '../gizmos/gizmos.service';
import { GizmoMetricsService } from '../gizmo-metrics/gizmo-metrics.service';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { setTimeout } from 'node:timers/promises';

@Processor(CHAT_GPTS_SYNC.name)
export class GizmoSearchProcessor {
  constructor(
    private chatOpenaiService: ChatOpenaiService,
    private authorService: AuthorService,
    private gizmosService: GizmosService,
    private gizmoMetricsService: GizmoMetricsService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Process(CHAT_GPTS_SYNC.jobs.query)
  async handleGPTsBySearchOnJob(job: Job) {
    const { query } = job.data;
    const queries = query.split(' ');
    for (let i = 0; i < queries.length; i++) {
      const text = queries[i].trim();
      if (text) {
        try {
          await this.syncGPTsBySearch(text);
          await setTimeout(CHAT_GPTS_SYNC.jobs.query.delay.success);
        } catch (e) {
          await setTimeout(CHAT_GPTS_SYNC.jobs.query.delay.exception);
          throw e;
        }
      }
    }
  }

  async syncGPTsByQueries(queries: string[]) {
    for (let i = 0; i < queries.length; i++) {
      await this.syncGPTsBySearch(queries[i]);
    }
  }
  async syncGPTsBySearch(query: string) {
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
      await this.gizmoMetricsService.createYesterdayByGpt(gpt);
    }

    return true;
  }
}
