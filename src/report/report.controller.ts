import { Controller, Post } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('statistics')
  statistics() {
    return this.reportService.statistics();
  }
}
