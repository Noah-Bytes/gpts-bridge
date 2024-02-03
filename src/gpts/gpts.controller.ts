import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { GptsService } from './gpts.service';
import { GptDot, GptsGptDot } from './dto/gpts-gpt.dot';
import { Gpt } from './entities/gpt.entity';

@Controller('gpts')
export class GptsController {
  constructor(private readonly gptsService: GptsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('list')
  async page(@Body() params: GptsGptDot) {
    const page = await this.gptsService.page(params);
    page.data = page.data.map((elem) => new Gpt(elem));
    return page;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('first')
  async getFirst(@Body() params: GptDot) {
    const source = await this.gptsService.findOne(params.id, params.date);
    return new Gpt(source);
  }
}
