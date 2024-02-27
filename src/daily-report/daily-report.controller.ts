import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { DailyReportService } from './daily-report.service';
import { PageDailyReportDto } from './dto/page-daily-report.dto';
import { DailyReport } from './entities/daily-report.entity';
import { ToolDailyReportDto } from './dto/tool-daily-report.dto';

@Controller('daily-report')
export class DailyReportController {
  constructor(private readonly dailyReportService: DailyReportService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('list')
  async page(@Body() params: PageDailyReportDto) {
    const page = await this.dailyReportService.page(params);
    page.data = page.data.map((elem) => new DailyReport(elem));
    return page;
  }

  @Post('calculate')
  async calculate(@Body() params: ToolDailyReportDto) {
    await this.dailyReportService.statisticsGpt(params.date);
  }
}
