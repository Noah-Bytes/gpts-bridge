import { Process, Processor } from '@nestjs/bull';
import { CHAT_GPTS_SYNC } from '../config/QUEUE_NAME';
import { Job } from 'bull';
import { Gpt } from '../chat-openai/dto/gpt.dto';
import { ChatOpenaiService } from '../chat-openai/chat-openai.service';
import { AuthorService } from '../author/author.service';
import { GizmoMetricsService } from '../gizmo-metrics/gizmo-metrics.service';
import { GizmosService } from '../gizmos/gizmos.service';
import { GizmoSearchService } from '../gizmo-search/gizmo-search.service';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Processor(CHAT_GPTS_SYNC.name)
export class CategoryProcessor {
  constructor(
    private chatOpenaiService: ChatOpenaiService,
    private authorService: AuthorService,
    private gizmoMetricsService: GizmoMetricsService,
    private gizmosService: GizmosService,
    private gizmoSearchService: GizmoSearchService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Process(CHAT_GPTS_SYNC.jobs.category)
  async handleGPTsByCategory(job: Job) {
    const { key } = job.data;

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
      await this.gizmoMetricsService.createYesterdayByGpt(gpt);

      /**
       * 创建搜索任务
       */
      await this.gizmoSearchService.createQueueTask(gpt.gizmo.display.name);
    }
    return true;
  }
}
