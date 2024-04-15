import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
  Req,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Roles } from 'src/users/users.decorator';
import { Role } from 'src/enum/roles.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/utils/image_upload';

const MAX_PROFILE_PICTURE_SIZE_IN_BYTES = 2 * 1024 * 1024;
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Roles(Role.User)
  @UsePipes(ValidationPipe)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  create(
    @Body() createArticleDto: CreateArticleDto,
    @Req() req,
    @UploadedFile() image,
  ) {
    return this.articlesService.create(createArticleDto, req, image);
  }

  @Get()
  findAll() {
    return this.articlesService.findAll();
  }

  @Get('homeCard')
  findForHomeCard() {
    return this.articlesService.findForHomeCard();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }

  @Roles(Role.User)
  @UsePipes(ValidationPipe)
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @Req() req,
    @UploadedFile() image,
  ) {
    return this.articlesService.update(id, updateArticleDto, req, image);
  }

  @Roles(Role.User)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.articlesService.remove(id, req);
  }
}
