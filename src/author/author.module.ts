import { Module } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';
import { PrismaService } from '../prisma.service';
import { ChatOpenaiModule } from '../chat-openai/chat-openai.module';
import { BullModule } from '@nestjs/bull';
import { CHAT_GPTS_SYNC } from '../config/QUEUE_NAME';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: CHAT_GPTS_SYNC.name,
    }),
    ChatOpenaiModule,
  ],
  controllers: [AuthorController],
  providers: [PrismaService, AuthorService],
  exports: [AuthorService],
})
export class AuthorModule {}
