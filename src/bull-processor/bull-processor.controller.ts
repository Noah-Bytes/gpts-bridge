import { Body, Controller, Post } from '@nestjs/common';
import { CategoryProcessor } from './category.processor';
import { CategoryProcessorDto } from './dto/category-processor.dto';
import { QueryProcessorDto } from './dto/query-processor.dto';
import { GizmoSearchProcessor } from './gizmo-search.processor';
import { AuthorProcessorDto } from './dto/author.processor.dto';
import { AuthorProcessor } from './author.processor';

@Controller('sync')
export class BullProcessorController {
  constructor(
    private readonly categoryProcessor: CategoryProcessor,
    private readonly gizmoSearchProcessor: GizmoSearchProcessor,
    private readonly authorProcessor: AuthorProcessor,
  ) {}

  @Post('gpt_by_category')
  runCategory(@Body() params: CategoryProcessorDto) {
    return this.categoryProcessor.syncGPTsByCategory(params.id);
  }

  @Post('gpt_by_query')
  runQuery(@Body() params: QueryProcessorDto) {
    return this.gizmoSearchProcessor.syncGPTsByQueries(params.queries);
  }

  @Post('gpt_by_user')
  runAuthor(@Body() params: AuthorProcessorDto) {
    return this.authorProcessor.syncGPTsByUserId(params.userId);
  }
}
