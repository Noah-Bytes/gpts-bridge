import { Inject, Injectable } from '@nestjs/common';
import type { gizmo as GizmoModel } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import * as dayjs from 'dayjs';
import { PrismaService } from '../prisma.service';
import { PageGizmosDto } from './dto/page-gizmos.dto';
import { paginate } from '../utils/page';
import { Gpt } from '../chat-openai/dto/gpt.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { LanguageService } from '../language/language.service';
import { TopGizmosDto } from './dto/get-gizmos.dto';

@Injectable()
export class GizmosService {
  userAgent: string;
  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
    private languageService: LanguageService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.userAgent = this.configService.get<string>('PC_USER_AGENT');
  }

  async upsertByGpt(gpt: Gpt) {
    const gizmos = this.formatByGpt(gpt);
    try {
      const old = await this.findOne(gizmos.id);

      if (!old || !old.language) {
        try {
          gizmos.language = this.languageService.guess(
            gizmos.name,
            1,
          )[0].language;
          await this.languageService.create({
            id: gizmos.language,
          });
        } catch (e) {
          gizmos.language = 'unknown';
        }
      }

      await this.prismaService.gizmo.upsert({
        where: {
          id: gizmos.id,
        },
        update: gizmos,
        create: gizmos,
      });
    } catch (e) {
      this.logger.error(e);
    }
  }

  page(params: PageGizmosDto) {
    return paginate<GizmoModel, any>(
      this.prismaService.gizmo,
      {
        where: {
          id: params.id,
          user_id: params.userId,
          categories: params.category,
        },
        orderBy: {
          updated_at: 'desc',
        },
      },
      {
        page: params.pageNo,
        perPage: params.pageSize,
      },
    );
  }

  findOne(id: string) {
    return this.prismaService.gizmo.findFirst({
      where: {
        id,
      },
    });
  }

  findByIds(ids: string[]) {
    return this.prismaService.gizmo.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  formatByGpt(gpt: Gpt): GizmoModel {
    const { gizmo, tools } = gpt;
    // @ts-ignore
    return {
      id: gizmo.id,
      user_id: gizmo.author.user_id,
      name: gizmo.display.name,
      image: gizmo.display.profile_picture_url,
      description: gizmo.display.description,
      welcome_message: gizmo.display.welcome_message,
      prompt_starters: gizmo.display.prompt_starters
        ? gizmo.display.prompt_starters.join('|')
        : undefined,
      short_url: gizmo.short_url,
      categories: gizmo.display.categories
        ? gizmo.display.categories.join('|')
        : undefined,
      updated_at: dayjs(gizmo.updated_at).toDate(),
      tags: gizmo.tags.join('|'),
      tools: tools.map((elem) => elem.type).join('|'),
    };
  }

  count() {
    return this.prismaService.gizmo.count();
  }

  top(params: TopGizmosDto) {
    return this.prismaService.gizmo.findMany({
      orderBy: {
        updated_at: 'desc',
      },
      take: params.limit,
    });
  }
}
