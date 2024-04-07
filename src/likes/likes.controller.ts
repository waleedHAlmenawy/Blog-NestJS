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
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { Roles } from 'src/users/users.decorator';
import { Role } from 'src/enum/roles.enum';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Roles(Role.User)
  @UsePipes(ValidationPipe)
  @Post(':article')
  toggle(@Param('article') article: string, @Req() req) {
    return this.likesService.create(article, req);
  }

  @Get(':article')
  findAll(@Param('article') article: string) {
    return this.likesService.findAll(article);
  }
}
