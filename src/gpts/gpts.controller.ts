import { Controller, Post, Body } from '@nestjs/common';
import { GptsService } from './gpts.service';
import { GptDot, GptsGptDot } from './dto/gpts-gpt.dot';

@Controller('gpts')
export class GptsController {
  constructor(private readonly gptsService: GptsService) {}

  @Post('list')
  page(@Body() params: GptsGptDot) {
    return this.gptsService.page(params);
  }

  @Post('first')
  getFirst(@Body() params: GptDot) {
    return this.gptsService.findOne(params.id, params.date);
  }
}
