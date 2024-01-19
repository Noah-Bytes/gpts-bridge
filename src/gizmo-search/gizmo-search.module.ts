import { Module } from '@nestjs/common';
import { GizmoSearchService } from './gizmo-search.service';
import { BullModule } from '@nestjs/bull';
import { CHAT_GPTS_SYNC } from '../config/QUEUE_NAME';
import { GizmosModule } from '../gizmos/gizmos.module';
import { GizmoMetricsModule } from '../gizmo-metrics/gizmo-metrics.module';
import { AuthorModule } from '../author/author.module';
import { ChatOpenaiModule } from '../chat-openai/chat-openai.module';

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
  providers: [GizmoSearchService],
})
export class GizmoSearchModule {}
