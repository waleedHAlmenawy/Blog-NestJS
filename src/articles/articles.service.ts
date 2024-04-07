import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from 'src/schemas/articles.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private articleSchema: Model<Article>,
    private jwt: JwtService,
  ) {}

  async create(createArticleDto: CreateArticleDto, req: Request) {
    const token = req.header('jwt');
    const payload = this.jwt.decode(token);

    const article = await this.articleSchema.create({
      ...createArticleDto,
      user: payload._id,
    });

    return {
      message: 'article add succesfully',
      article,
    };
  }

  async findAll() {
    const articles = await this.articleSchema.find().populate('user');

    return articles;
  }

  async findOne(id: string) {
    const article = await this.articleSchema.findById(id);

    return article;
  }

  async update(id: string, updateArticleDto: UpdateArticleDto, req: Request) {
    const token = req.header('jwt');
    const payload = this.jwt.decode(token);

    const article = await this.articleSchema.findById(id);

    if (article.user != payload._id) {
      return { message: 'forbidden' };
    }

    const updatedArticle = await this.articleSchema.updateOne(
      { _id: id },
      { ...updateArticleDto },
    );

    return updatedArticle;
  }

  async remove(id: string, req: Request) {
    const token = req.header('jwt');
    const payload = this.jwt.decode(token);

    const article = await this.articleSchema.findById(id);

    if (article.user != payload._id) {
      return { message: 'forbidden' };
    }

    const deletedArticle = await this.articleSchema.deleteOne({ _id: id });

    return deletedArticle;
  }
}
