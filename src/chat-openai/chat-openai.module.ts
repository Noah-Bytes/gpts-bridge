import { Module } from '@nestjs/common';
import { ChatOpenaiService } from './chat-openai.service';
import { ChatOpenaiController } from './chat-openai.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [ChatOpenaiController],
  providers: [ChatOpenaiService],
  exports: [ChatOpenaiService],
})
export class ChatOpenaiModule {}
