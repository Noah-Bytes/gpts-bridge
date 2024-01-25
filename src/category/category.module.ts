import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PrismaService } from '../prisma.service';
import { CategoryJob } from './category.job';
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
  controllers: [CategoryController],
  providers: [PrismaService, CategoryService, CategoryJob],
  exports: [CategoryService],
})
export class CategoryModule {}
