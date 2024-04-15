import { Injectable } from '@nestjs/common';
import { Like } from 'src/schemas/likes.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(Like.name) private likeSchema: Model<Like>,
    private jwt: JwtService,
  ) {}

  async create(article: string, req: Request) {
    const token = req.header('jwt');
    const payload = this.jwt.decode(token);

    const isLiked = await this.likeSchema.findOne({
      article,
      user: payload._id,
    });

    if (isLiked) {
      await this.likeSchema.deleteOne({
        user: payload._id,
        article,
      });

      return { message: 'unliked' };
    }

    const like = await this.likeSchema.create({
      user: payload._id,
      article,
    });

    return { message: 'liked' };
  }

  async findAll(article: string) {
    const likes = await this.likeSchema.find({ article });

    return likes;
  }
}
