import {
  Controller,
  Get,
  Post,
  Body,
  Query,
} from '@nestjs/common';
import { GizmoMetricsService } from './gizmo-metrics.service';
import { PageGizmoMetricsDto } from './dto/page-gizmo-metrics.dto';

@Controller('gizmo-metrics')
export class GizmoMetricsController {
  constructor(private readonly gizmoMetricsService: GizmoMetricsService) {}

  @Post('list')
  page(@Body() params: PageGizmoMetricsDto) {
    return this.gizmoMetricsService.page(params);
  }

  @Get('')
  findOne(@Query('gizmoId') gizmoId: string, @Query('date') date: string) {
    return this.gizmoMetricsService.findOne(gizmoId, date);
  }
}
