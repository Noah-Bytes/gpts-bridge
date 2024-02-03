import { Injectable } from '@nestjs/common';
import { GizmosService } from '../gizmos/gizmos.service';
import { AuthorService } from '../author/author.service';
import { GizmoMetricsService } from '../gizmo-metrics/gizmo-metrics.service';
import { GptsGptDot } from './dto/gpts-gpt.dot';
import { keyBy } from 'lodash';
import { Gpt } from './entities/gpt.entity';
import { map } from 'lodash';

@Injectable()
export class GptsService {
  constructor(
    private gizmosService: GizmosService,
    private authorService: AuthorService,
    private gizmoMetricsService: GizmoMetricsService,
  ) {}
  async page(request: GptsGptDot): Promise<{
    data: Gpt[];
    meta: any;
  }> {
    const page = await this.gizmosService.page({
      pageNo: request.pageNo,
      pageSize: request.pageSize,
      userId: request.userId,
      category: request.category,
    });

    const userIds = map(page.data, 'user_id');
    const gizmosIds = map(page.data, 'id');

    const authors = await this.authorService.findInUserIds(userIds);
    const authorMap = keyBy(authors, 'user_id');

    let metricsMap: any;

    if (request.date) {
      const metrics = await this.gizmoMetricsService.findIn(
        gizmosIds,
        request.date,
      );
      metricsMap = keyBy(metrics, 'gizmo_id');
    }

    const list: Gpt[] = [];

    page.data.map((elem) => {
      const item: Gpt = {
        gizmos: elem,
        author: authorMap[elem.user_id],
      };
      if (metricsMap) {
        item.metrics = metricsMap[elem.id];
      }
      list.push(item);
    });

    return {
      data: list,
      meta: page.meta,
    };
  }

  async findOne(id: string, date?: string): Promise<Gpt> {
    const gizmos = await this.gizmosService.findOne(id);
    const author = await this.authorService.findOne(gizmos.user_id);
    if (date) {
      const metrics = await this.gizmoMetricsService.findOne(id, date);

      return {
        gizmos,
        author,
        metrics,
      };
    }

    return {
      gizmos,
      author,
    };
  }
}
