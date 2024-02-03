import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { GizmoMetricsService } from './gizmo-metrics.service';
import { PageGizmoMetricsDto } from './dto/page-gizmo-metrics.dto';
import { TopGizmosDto } from '../gizmos/dto/get-gizmos.dto';
import { idDecrypt } from '../utils/confuse';
import { GizmoMetric } from './entities/gizmo-metric.entity';

@Controller('gizmo-metrics')
export class GizmoMetricsController {
  constructor(private readonly gizmoMetricsService: GizmoMetricsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('list')
  async page(@Body() params: PageGizmoMetricsDto) {
    const page = await this.gizmoMetricsService.page(params);
    page.data = page.data.map((elem) => new GizmoMetric(elem));
    return page;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('')
  async findOne(
    @Query('gizmoId') gizmoId: string,
    @Query('date') date: string,
  ) {
    const source = await this.gizmoMetricsService.findOne(
      idDecrypt(gizmoId),
      date,
    );
    return new GizmoMetric(source);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('top')
  async top(@Body() params: TopGizmosDto) {
    const list = await this.gizmoMetricsService.top(params);
    return list.map((elem) => new GizmoMetric(elem));
  }
}
