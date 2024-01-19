import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { AuthorService } from './author.service';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { PageAuthorDto } from './dto/page-author.dto';

@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post('list')
  page(@Body() pageAuthorDto: PageAuthorDto) {
    return this.authorService.page(pageAuthorDto);
  }

  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    return this.authorService.findOne(userId);
  }

  @Patch(':userId')
  update(
    @Param('userId') userId: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ) {
    return this.authorService.update(userId, updateAuthorDto);
  }
}
