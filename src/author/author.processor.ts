import { Process, Processor } from '@nestjs/bull';
import { CHAT_GPTS_SYNC } from '../config/QUEUE_NAME';
import { Job } from 'bull';
import { AuthorService } from './author.service';

@Processor(CHAT_GPTS_SYNC.name)
export class AuthorProcessor {
  constructor(private authorService: AuthorService) {}

  @Process(CHAT_GPTS_SYNC.jobs.userId)
  async handleCategory(job: Job) {
    const { userId } = job.data;
    await this.authorService.syncByUser(userId);
    return true;
  }
}
