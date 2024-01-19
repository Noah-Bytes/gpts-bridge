import { Process, Processor } from '@nestjs/bull';
import { CHAT_GPTS_SYNC } from '../config/QUEUE_NAME';
import { Job } from 'bull';
import { CategoryService } from './category.service';

@Processor(CHAT_GPTS_SYNC.name)
export class CategoryProcessor {
  constructor(private categoryService: CategoryService) {}

  @Process(CHAT_GPTS_SYNC.jobs.category)
  async handleCategory(job: Job) {
    const { key } = job.data;
    await this.categoryService.syncByCategory(key);
    return true;
  }
}
