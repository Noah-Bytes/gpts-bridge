import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GizmosService } from './gizmos.service';
import { PageGizmosDto } from './dto/page-gizmos.dto';
import { TopGizmosMetricsDto } from '../gizmo-metrics/dto/get-gizmo-metrics.dto';

@Controller('gizmos')
export class GizmosController {
  constructor(private readonly gizmosService: GizmosService) {}

  @Post('list')
  page(@Body() params: PageGizmosDto) {
    return this.gizmosService.page(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gizmosService.findOne(id);
  }

  @Post('top')
  top(@Body() params: TopGizmosMetricsDto) {
    return this.gizmosService.top(params);
  }

  @Get('uv/:id')
  uv(@Param('id') id: string) {
    return this.gizmosService.uv(id);
  }

  @Get('pv/:id')
  pv(@Param('id') id: string) {
    return this.gizmosService.pv(id);
  }

  @Get('like/:id')
  like(@Param('id') id: string) {
    return this.gizmosService.like(id);
  }

  @Get('un_like/:id')
  unLike(@Param('id') id: string) {
    return this.gizmosService.unLike(id);
  }

  @Get('share/:id')
  share(@Param('id') id: string) {
    return this.gizmosService.share(id);
  }
}
