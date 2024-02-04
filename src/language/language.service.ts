import { Inject, Injectable } from '@nestjs/common';
import { CreateLanguageDto } from './dto/create-language.dto';
import { PrismaService } from '../prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Language } from 'node-nlp';
import { IGuess } from './entities/language.entity';
import { PageLanguageDto } from './dto/page-language.dto';
import { paginate } from '../utils/page';

const language = new Language();

@Injectable()
export class LanguageService {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  guess(text: string, limit: number): IGuess[] {
    return language.guess(text, null, limit);
  }

  async create(createLanguageDto: CreateLanguageDto) {
    this.logger.info(createLanguageDto.id);
    const old = this.findOne(createLanguageDto.id);
    if (!old) {
      this.prismaService.language.create({
        data: createLanguageDto,
      });
    }
  }

  page(params: PageLanguageDto) {
    return paginate(
      this.prismaService.language,
      {
        where: {
          id: params.id,
        },
        orderBy: {
          date: 'desc',
        },
      },
      {
        page: params.pageNo,
        perPage: params.pageSize,
      },
    );
  }

  findOne(id: string) {
    return this.prismaService.language.findFirst({
      where: {
        id,
      },
    });
  }

  count() {
    return this.prismaService.language.count();
  }
}
