import { Controller } from '@nestjs/common';
import { DailyReportService } from './daily-report.service';

@Controller('daily-report')
export class DailyReportController {
  constructor(private readonly dailyReportService: DailyReportService) {}
}
