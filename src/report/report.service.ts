import { Injectable } from '@nestjs/common';
import { GizmosService } from '../gizmos/gizmos.service';
import { StatisticsReport } from './entities/report.entity';
import { AuthorService } from '../author/author.service';
import { LanguageService } from '../language/language.service';
import { CategoryService } from '../category/category.service';

@Injectable()
export class ReportService {
  constructor(
    private readonly gizmosService: GizmosService,
    private readonly authorService: AuthorService,
    private readonly languageService: LanguageService,
    private readonly categoryService: CategoryService,
  ) {}
  async statistics(): Promise<StatisticsReport> {
    const gizmosTotal = await this.gizmosService.count();
    const authorTotal = await this.authorService.count();
    const languageTotal = await this.languageService.count();
    const categoryTotal = await this.categoryService.count();
    return {
      gizmo: gizmosTotal,
      author: authorTotal,
      language: languageTotal,
      category: categoryTotal,
    };
  }
}
