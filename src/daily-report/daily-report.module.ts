import { Module } from '@nestjs/common';
import { DailyReportService } from './daily-report.service';
import { DailyReportController } from './daily-report.controller';
import { GizmosModule } from '../gizmos/gizmos.module';
import { AuthorModule } from '../author/author.module';
import { LanguageModule } from '../language/language.module';
import { CategoryModule } from '../category/category.module';
import { PrismaService } from '../prisma.service';
import { DailyReportJob } from './daily-report.job';

@Module({
  imports: [GizmosModule, AuthorModule, LanguageModule, CategoryModule],
  controllers: [DailyReportController],
  providers: [PrismaService, DailyReportService, DailyReportJob],
})
export class DailyReportModule {}
