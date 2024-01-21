import { Module } from '@nestjs/common';
import { GizmoSearchService } from './gizmo-search.service';
import { BullModule } from '@nestjs/bull';
import { CHAT_GPTS_SYNC } from '../config/QUEUE_NAME';
import { ChatOpenaiModule } from '../chat-openai/chat-openai.module';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: CHAT_GPTS_SYNC.name,
    }),
    ChatOpenaiModule,
  ],
  providers: [GizmoSearchService],
  exports: [GizmoSearchService],
})
export class GizmoSearchModule {}
