import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { CreateMessageDto } from './dtos/create-message.dto.js';
import { MessagesService } from './messages.service.js';

@Controller('messages')
export class MessagesController {
  constructor(public messagesService: MessagesService) {}

  /**
   * listMessages
   */
  @Get()
  public listMessages() {
    return this.messagesService.findAll();
  }

  /**
   * createMessages
   */
  @Post()
  public createMessages(@Body() body: CreateMessageDto) {
    return this.messagesService.create(body.content);
  }

  /**
   * getMessage
   */
  @Get('/:id')
  public async getMessage(@Param('id') id: string) {
    const message = await this.messagesService.findOne(id);

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return message;
  }
}
