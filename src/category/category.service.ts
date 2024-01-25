import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CHAT_GPTS_SYNC } from '../config/QUEUE_NAME';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class CategoryService {
  constructor(
    private prismaService: PrismaService,
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

  async runSyncGpt() {
    const list = await this.findAll();
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      this.logger.info('【队列】生成 %s 任务', item.id);
      await this.gtpSyncQueue.add(
        CHAT_GPTS_SYNC.jobs.category,
        {
          key: item.key,
        },
        {
          jobId: item.key,
          repeat: {
            cron: '0 0 * * *',
          },
        },
      );
    }
  }

  count() {
    return this.prismaService.category.count();
  }
}
