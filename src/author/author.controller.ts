import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthorService } from './author.service';
import { PageAuthorDto } from './dto/page-author.dto';
import { GetTopAuthorDto } from './dto/get-author.dto';
import { idDecrypt } from '../utils/confuse';
import { Author } from './entities/author.entity';

@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('list')
  async page(@Body() pageAuthorDto: PageAuthorDto) {
    const page = await this.authorService.page(pageAuthorDto);
    page.data = page.data.map((elem) => new Author(elem));

    return page;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':userId')
  async findOne(@Param('userId') userId: string) {
    const source = await this.authorService.findOne(idDecrypt(userId));
    return new Author(source);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('top')
  async top(@Body() params: GetTopAuthorDto) {
    const source = await this.authorService.top(params);
    return source.map((elem) => new Author(elem));
  }
}
