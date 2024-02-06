import { Inject, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from '../prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class ArticleService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  create(createArticleDto: CreateArticleDto) {
    return 'This action adds a new article';
  }

  findAll() {
    return `This action returns all article`;
  }

  findOne(title: string) {
    return this.prismaService.article.findUnique({
      where: {
        title,
      },
    });
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }
}
