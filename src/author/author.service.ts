import { Inject, Injectable } from '@nestjs/common';
import { UpdateAuthorDto } from './dto/update-author.dto';
import type { author as AuthorModel } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { PageAuthorDto } from './dto/page-author.dto';
import { paginate } from '../utils/page';
import { Gpt } from '../chat-openai/dto/gpt.dto';
import { InjectQueue } from '@nestjs/bull';
import { CHAT_GPTS_SYNC } from '../config/QUEUE_NAME';
import { Queue } from 'bull';
import { ChatOpenaiService } from '../chat-openai/chat-openai.service';
import { GizmosService } from '../gizmos/gizmos.service';
import { GizmoMetricsService } from '../gizmo-metrics/gizmo-metrics.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class AuthorService {
  constructor(
    private prismaService: PrismaService,
    private chatOpenaiService: ChatOpenaiService,
    private gizmosService: GizmosService,
    private gizmoMetricsService: GizmoMetricsService,
    @InjectQueue(CHAT_GPTS_SYNC.name) private readonly gtpSyncQueue: Queue,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  async upsertByGpt(gpt: Gpt) {
    const author = this.formatByGpt(gpt);
    await this.prismaService.author.upsert({
      where: {
        user_id: author.user_id,
      },
      update: author,
      create: author,
    });
  }

  async createByGpt(gpt: Gpt) {
    const author = this.formatByGpt(gpt);
    await this.prismaService.author.create({
      data: author,
    });
  }

  async page(params: PageAuthorDto) {
    return paginate(
      this.prismaService.author,
      {
        where: {
          user_id: params.userId,
        },
        orderBy: {
          create_time: 'desc',
        },
      },
      {
        page: params.pageNo,
        perPage: params.pageSize,
      },
    );
  }

  async findOne(userId: string) {
    return await this.prismaService.author.findFirst({
      where: {
        user_id: userId,
      },
    });
  }

  findInUserIds(userIds: string[]) {
    return this.prismaService.author.findMany({
      where: {
        user_id: {
          in: userIds,
        },
      },
    });
  }

  async update(userId: string, updateAuthorDto: UpdateAuthorDto) {
    await this.prismaService.author.update({
      data: updateAuthorDto,
      where: {
        user_id: userId,
      },
    });
  }

  formatByGpt(item: Gpt): AuthorModel {
    const { author } = item.gizmo;
    // @ts-expect-error
    return {
      user_id: author.user_id,
      display_name: author.display_name,
      link_to: author.link_to,
      selected_display: author.selected_display,
      is_verified: author.is_verified,
      will_receive_support_emails: author.will_receive_support_emails,
    };
  }

  async createQueueTask(userId: string) {
    await this.gtpSyncQueue.add(
      CHAT_GPTS_SYNC.jobs.userId,
      {
        userId,
      },
      {
        jobId: userId,
      },
    );
  }

  /**
   * 根据用户获取gpts
   * @param userId
   */
  async syncByUser(userId: string) {
    this.logger.info('【用户维度同步】开始同步%s', userId);
    const { items } = await this.chatOpenaiService.getGizmosByUser(userId);
    this.logger.info(
      '【用户维度同步】 userId: %s 同步到 %s 个 gpt',
      userId,
      items.length,
    );
    for (let i = 0; i < items.length; i++) {
      const gpt = items[i];
      // 更新作者
      await this.upsertByGpt(gpt);
      // 更新gpt信息
      await this.gizmosService.upsertByGpt(gpt);
      // 更新数据
      await this.gizmoMetricsService.createByGpt(gpt);
    }
  }
}
