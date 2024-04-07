import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticlesModule } from './articles/articles.module';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { UserGuard } from './users/users.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ArticlesModule,
    UsersModule,
    CommentsModule,
    LikesModule,
    MongooseModule.forRoot(
      'mongodb+srv://waleedAlmenawy:nf3VSmHh27xHStWa@iti.t3i9ucu.mongodb.net/blog',
    ),
    JwtModule.register({
      secret: 'secret',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: UserGuard,
    },
  ],
})
export class AppModule {}
