import { Inject, Injectable } from '@nestjs/common';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { author as AuthorModel, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { PageAuthorDto } from './dto/page-author.dto';
import { paginate } from '../utils/page';
import { Gpt } from '../chat-openai/dto/gpt.dto';
import { InjectQueue } from '@nestjs/bull';
import { CHAT_GPTS_SYNC } from '../config/QUEUE_NAME';
import { Queue } from 'bull';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { GetTopAuthorDto } from './dto/get-author.dto';

@Injectable()
export class AuthorService {
  constructor(
    private prismaService: PrismaService,
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
          create_time: Prisma.SortOrder.desc,
        },
      },
      {
        page: params.pageNo,
        perPage: params.pageSize,
      },
    );
  }

  findOne(userId: string) {
    return this.prismaService.author.findFirst({
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
      CHAT_GPTS_SYNC.jobs.userId.name,
      {
        userId,
      },
      {
        jobId: userId,
        repeat: {
          cron: CHAT_GPTS_SYNC.jobs.userId.repeatCron,
        },
      },
    );
  }

  count() {
    return this.prismaService.author.count();
  }

  top(params: GetTopAuthorDto) {
    return this.prismaService.author.findMany({
      orderBy: {
        gpt_total: Prisma.SortOrder.desc,
      },
      take: params.limit,
    });
  }
}
