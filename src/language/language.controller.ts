import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { LanguageService } from './language.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import { PageLanguageDto } from './dto/page-language.dto';

@Controller('language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Post()
  create(@Body() createLanguageDto: CreateLanguageDto) {
    return this.languageService.create(createLanguageDto);
  }

  @Post('list')
  page(@Body() params: PageLanguageDto) {
    return this.languageService.page(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.languageService.findOne(id);
  }
}
