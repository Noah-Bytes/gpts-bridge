import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ListByCategoryDto } from './dto/list.dto';
import { DiscoveryEntity, GizmoByUserId } from './entities/discovery.entity';
import { GptsQueryByApi } from './entities/gpts-query.entity';
import { Gpt } from './dto/gpt.dto';

@Injectable()
export class ChatOpenaiService {
  userAgent: string;
  authorization: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.userAgent = this.configService.get<string>('PC_USER_AGENT');
    this.authorization = this.configService.get<string>('GPT_AUTHORIZATION');
  }

  /**
   * 根据shortUrl 获取单个gpt信息
   * @param shortUrl
   */
  async getGizmosByShorUrl(shortUrl: string): Promise<Gpt> {
    const { data: resp } = await this.httpService.axiosRef({
      method: 'get',
      url: `https://chat.openai.com/backend-api/gizmos/${shortUrl}`,
      headers: {
        authority: 'chat.openai.com',
        referer: 'https://chat.openai.com/gpts',
        'user-agent': this.userAgent,
        authorization: this.authorization,
      },
    });

    return resp;
  }

  /**
   * 根据类目获取gpts
   * @param listByCategoryDto
   */
  async getGizmosByCategory(
    listByCategoryDto: ListByCategoryDto,
  ): Promise<DiscoveryEntity> {
    const { data: resp } = await this.httpService.axiosRef({
      method: 'get',
      url: `https://chat.openai.com/public-api/gizmos/discovery/${listByCategoryDto.key}?cursor=${listByCategoryDto.cursor}&limit=${listByCategoryDto.limit}&locale=${listByCategoryDto?.locale || 'global'}`,
      headers: {
        authority: 'chat.openai.com',
        referer: 'https://chat.openai.com/gpts',
        'user-agent': this.userAgent,
      },
    });

    return resp;
  }

  /**
   * 搜索gpts
   * @param query
   */
  async getGizmosByQuery(query: string): Promise<GptsQueryByApi> {
    const { data: resp } = await this.httpService.axiosRef({
      method: 'get',
      url: `https://chat.openai.com/backend-api/gizmos/search?q=${query}`,
      headers: {
        authority: 'chat.openai.com',
        Host: 'chat.openai.com',
        referer: 'https://chat.openai.com/gpts',
        'user-agent': this.userAgent,
        authorization: this.authorization,
      },
    });

    return resp;
  }

  /**
   * 获取用户下面的gpts
   * @param userId
   */
  async getGizmosByUser(userId: string): Promise<GizmoByUserId> {
    const { data: resp } = await this.httpService.axiosRef({
      method: 'get',
      url: `https://chat.openai.com/backend-api//gizmos/u/${userId}`,
      headers: {
        authority: 'chat.openai.com',
        referer: 'https://chat.openai.com/gpts',
        'user-agent': this.userAgent,
        authorization: this.authorization,
      },
    });

    return resp;
  }
}
