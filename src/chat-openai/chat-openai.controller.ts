import { Controller, Post, Body } from '@nestjs/common';
import { ChatOpenaiService } from './chat-openai.service';
import {
  ListByCategoryDto,
  ListBySearchDto,
  ListByUserIdDto,
} from './dto/list.dto';

@Controller('chat-openai')
export class ChatOpenaiController {
  constructor(private readonly chatOpenaiService: ChatOpenaiService) {}

  @Post('gizmos_by_category')
  getGizmosByCategory(@Body() listByCategoryDto: ListByCategoryDto) {
    return this.chatOpenaiService.getGizmosByCategory(listByCategoryDto);
  }

  @Post('gizmos_by_user')
  getGizmosByUser(@Body() listByUserIdDto: ListByUserIdDto) {
    return this.chatOpenaiService.getGizmosByUser(listByUserIdDto.userId);
  }

  @Post('gizmos_by_search')
  getGizmosByQuery(@Body() listBySearchDto: ListBySearchDto) {
    return this.chatOpenaiService.getGizmosByQuery(listBySearchDto.query);
  }
}
