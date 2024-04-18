import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from 'src/schemas/articles.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { shuffle } from 'src/utils/shuffle';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private articleSchema: Model<Article>,
    private jwt: JwtService,
  ) {}

  async create(createArticleDto: CreateArticleDto, req: Request, image: any) {
    const token = req.header('jwt');
    const payload = this.jwt.decode(token);

    const article = await this.articleSchema.create({
      ...createArticleDto,
      user: payload._id,
      image: process.env.IMAGE_URL + image.filename,
    });

    return {
      message: 'article add succesfully',
      article,
    };
  }

  async findAll() {
    const articles = await this.articleSchema
      .find({ isDeleted: false })
      .populate('user');

    return articles;
  }

  async findForHomeCard() {
    const articles = shuffle(
      await this.articleSchema.find({ isDeleted: false }).populate('user'),
    );

    articles.length = 3;

    return articles;
  }

  async findOne(id: string) {
    const article = await this.articleSchema.findById(id).populate('user');

    return article;
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
    req: Request,
    image: any,
  ) {
    const token = req.header('jwt');
    const payload = this.jwt.decode(token);

    const article = await this.articleSchema.findById(id);

    if (article.user != payload._id) {
      return { message: 'forbidden' };
    }

    var imageUrl = article.image;

    if (image) {
      imageUrl = process.env.IMAGE_URL + image.filename;
    }

    const updatedArticle = await this.articleSchema.updateOne(
      { _id: id },
      { ...updateArticleDto, image: imageUrl },
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

    const deletedArticle = await this.articleSchema.updateOne(
      { _id: id },
      { isDeleted: true },
    );

    return deletedArticle;
  }
}
