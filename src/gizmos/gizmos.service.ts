import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
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
import { getNumConversationsStr } from '../utils/format';
import { Prisma } from '@prisma/client';
import { GizmosModule } from './gizmos.module';

@Injectable()
export class GizmosService {
  userAgent: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly languageService: LanguageService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.userAgent = this.configService.get<string>('PC_USER_AGENT');
  }

  async upsertByGpt(gpt: Gpt) {
    const gizmos = this.formatByGpt(gpt);
    try {
      const old = await this.findOne(gizmos.id);

      //  start 处理语言
      if (!old || !old.language) {
        try {
          const text = gizmos.name || gizmos.description;
          gizmos.language = this.languageService.guess(text, 1)[0].language;
          await this.languageService.create({
            id: gizmos.language,
          });
        } catch (e) {
          gizmos.language = 'unknown';
        }
      }
      // end

      await this.prismaService.gizmo.upsert({
        where: {
          id: gizmos.id,
        },
        update: gizmos,
        create: gizmos,
      });
    } catch (e) {
      this.logger.error(e, gpt.gizmo.id);
    }
  }

  update(id: string, gizmos: Partial<GizmosModule>) {
    return this.prismaService.gizmo.update({
      where: {
        id,
      },
      data: gizmos,
    });
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
          updated_at: Prisma.SortOrder.desc,
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
    const num = getNumConversationsStr(
      gpt.gizmo.vanity_metrics.num_conversations_str,
    );
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
      create_time: dayjs(gizmo.created_at).toDate(),
      tags: gizmo.tags.join('|'),
      tools: JSON.stringify(tools),
      // @ts-ignore
      conversations: isNaN(num) ? undefined : num,
    };
  }

  count() {
    return this.prismaService.gizmo.count();
  }

  topForUpdate(params: TopGizmosDto) {
    return this.prismaService.gizmo.findMany({
      orderBy: {
        updated_at: Prisma.SortOrder.desc,
      },
      take: params.limit,
    });
  }

  topForNewest(params: TopGizmosDto) {
    return this.prismaService.gizmo.findMany({
      orderBy: {
        create_time: Prisma.SortOrder.desc,
      },
      take: params.limit,
    });
  }

  async setConversations(id: string, total: bigint) {
    const item = await this.findOne(id);
    if (!item) {
      throw new ForbiddenException();
    }

    await this.prismaService.gizmo.update({
      where: {
        id,
      },
      data: {
        conversations: total,
      },
    });
  }

  async like(id: string) {
    const item = await this.findOne(id);

    if (!item) {
      throw new ForbiddenException();
    }

    await this.prismaService.gizmo.update({
      where: {
        id,
      },
      data: {
        like: item.like + BigInt(1),
      },
    });
  }

  async unLike(id: string) {
    const item = await this.findOne(id);

    if (!item) {
      throw new ForbiddenException();
    }

    if (item.like <= 0) {
      throw new BadRequestException('not like');
    }

    await this.prismaService.gizmo.update({
      where: {
        id,
      },
      data: {
        like: item.like + BigInt(1),
      },
    });
  }

  async pv(id: string) {
    const item = await this.findOne(id);

    if (!item) {
      throw new ForbiddenException();
    }

    await this.prismaService.gizmo.update({
      where: {
        id,
      },
      data: {
        pv: item.pv + BigInt(1),
      },
    });
  }

  async uv(id: string) {
    const item = await this.findOne(id);

    if (!item) {
      throw new ForbiddenException();
    }

    await this.prismaService.gizmo.update({
      where: {
        id,
      },
      data: {
        uv: item.uv + BigInt(1),
      },
    });
  }

  async share(id: string) {
    const item = await this.findOne(id);

    if (!item) {
      throw new ForbiddenException();
    }

    await this.prismaService.gizmo.update({
      where: {
        id,
      },
      data: {
        uv: item.uv + BigInt(1),
      },
    });
  }
}
