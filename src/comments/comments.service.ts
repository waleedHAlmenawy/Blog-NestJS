import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from 'src/schemas/comments.schema';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { Request } from 'express';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentSchema: Model<Comment>,
    private jwt: JwtService,
  ) {}

  async create(createCommentDto: CreateCommentDto, id: string, req: Request) {
    const token = req.header('jwt');
    const payload = this.jwt.decode(token);

    const comment = await this.commentSchema.create({
      ...createCommentDto,
      user: payload._id,
      article: id,
    });

    return {
      message: 'comment added succesfully',
      comment,
    };
  }

  async findAll(article) {
    const comments = await this.commentSchema
      .find({ article })
      .populate('user');

    return comments;
  }

  async remove(article: string, id: string, req: Request) {
    const token = req.header('jwt');
    const payload = this.jwt.decode(token);

    const comment = await this.commentSchema.findById(id);

    if (comment.user != payload._id) {
      return { message: 'forbidden' };
    }

    const deletedComment = await this.commentSchema.deleteOne({ _id: id, article });

    return deletedComment;
  }
}
