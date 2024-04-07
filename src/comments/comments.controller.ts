import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Roles } from 'src/users/users.decorator';
import { Role } from 'src/enum/roles.enum';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Roles(Role.User)
  @UsePipes(ValidationPipe)
  @Post(':article')
  create(
    @Param('article') article: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req,
  ) {
    return this.commentsService.create(createCommentDto, article, req);
  }

  @Get(':article')
  findAll(@Param('article') article: string) {
    return this.commentsService.findAll(article);
  }

  @Roles(Role.User)
  @UsePipes(ValidationPipe)
  @Delete(':article/:id')
  remove(
    @Param('article') article: string,
    @Param('id') id: string,
    @Req() req,
  ) {
    return this.commentsService.remove(article, id, req);
  }
}
