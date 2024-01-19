import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PrismaService } from '../prisma.service';
import { CategoryJob } from './category.job';
import { BullModule } from '@nestjs/bull';
import { CHAT_GPTS_SYNC } from '../config/QUEUE_NAME';
import { CategoryProcessor } from './category.processor';
import { ChatOpenaiModule } from '../chat-openai/chat-openai.module';
import { AuthorModule } from '../author/author.module';
import { GizmosModule } from '../gizmos/gizmos.module';
import { GizmoMetricsModule } from '../gizmo-metrics/gizmo-metrics.module';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: CHAT_GPTS_SYNC.name,
    }),
    ChatOpenaiModule,
    AuthorModule,
    GizmosModule,
    GizmoMetricsModule,
  ],
  controllers: [CategoryController],
  providers: [PrismaService, CategoryService, CategoryJob, CategoryProcessor],
})
export class CategoryModule {}
