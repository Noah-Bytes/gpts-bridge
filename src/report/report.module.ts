import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { GizmosModule } from '../gizmos/gizmos.module';
import { AuthorModule } from '../author/author.module';
import { LanguageModule } from '../language/language.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [GizmosModule, AuthorModule, LanguageModule, CategoryModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
