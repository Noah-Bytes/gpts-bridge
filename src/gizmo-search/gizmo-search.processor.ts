import { Process, Processor } from '@nestjs/bull';
import { CHAT_GPTS_SYNC } from '../config/QUEUE_NAME';
import { Job } from 'bull';
import { GizmoSearchService } from './gizmo-search.service';

@Processor(CHAT_GPTS_SYNC.name)
export class CategoryProcessor {
  constructor(private gizmoSearchService: GizmoSearchService) {}

  @Process(CHAT_GPTS_SYNC.jobs.query)
  async handleCategory(job: Job) {
    const { query } = job.data;
    await this.gizmoSearchService.syncByQuery(query);
    return true;
  }
}
