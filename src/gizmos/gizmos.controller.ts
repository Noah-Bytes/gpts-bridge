import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { GizmosService } from './gizmos.service';
import { PageGizmosDto } from './dto/page-gizmos.dto';
import { TopGizmosMetricsDto } from '../gizmo-metrics/dto/get-gizmo-metrics.dto';
import { Gizmo } from './entities/gizmo.entity';
import { IdPipe } from '../utils/id.pipe';

@Controller('gizmos')
export class GizmosController {
  constructor(private readonly gizmosService: GizmosService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('list')
  async page(@Body() params: PageGizmosDto) {
    const page = await this.gizmosService.page(params);
    page.data = page.data.map((elem) => new Gizmo(elem));
    return page;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id', new IdPipe()) id: string) {
    const source = await this.gizmosService.findOne(id);
    return new Gizmo(source);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('top_update')
  async topForUpdate(@Body() params: TopGizmosMetricsDto): Promise<Gizmo[]> {
    const source = await this.gizmosService.topForUpdate(params);
    return source.map((elem) => new Gizmo(elem));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('top_newest')
  async topForNewest(@Body() params: TopGizmosMetricsDto): Promise<Gizmo[]> {
    const source = await this.gizmosService.topForNewest(params);
    return source.map((elem) => new Gizmo(elem));
  }

  @Get('uv/:id')
  uv(@Param('id', new IdPipe()) id: string) {
    return this.gizmosService.uv(id);
  }

  @Get('pv/:id')
  pv(@Param('id', new IdPipe()) id: string) {
    return this.gizmosService.pv(id);
  }

  @Get('like/:id')
  like(@Param('id', new IdPipe()) id: string) {
    return this.gizmosService.like(id);
  }

  @Get('un_like/:id')
  unLike(@Param('id', new IdPipe()) id: string) {
    return this.gizmosService.unLike(id);
  }

  @Get('share/:id')
  share(@Param('id', new IdPipe()) id: string) {
    return this.gizmosService.share(id);
  }
}
