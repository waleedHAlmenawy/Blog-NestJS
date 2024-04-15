import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/users.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { images } from 'src/utils/profile_images';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwt: JwtService,
  ) {}

  async Reg(user: RegisterDto) {
    /* Check If Email Exists */

    let isEmailExists = await this.userModel.findOne({ email: user.email });

    if (isEmailExists) {
      throw new HttpException(
        'The email already exists',
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    /* Password Hashing By Bcrypt */

    let salt = await bcrypt.genSalt(10);
    let passwordHashing = await bcrypt.hash(user.password, salt);

    /* Override Password & Email */

    user.password = passwordHashing;
    user.email = user.email.toLowerCase();

    /* Adding Random Image */

    const image = images[Math.floor(Math.random() * 5)];

    /* Create New Instance From User*/

    await this.userModel.create({ ...user, image });
    return { message: 'Added succesfully' };
  }

  async Log(user: LoginDto, res: Response) {
    /* Check Email */

    const checkUser = await this.userModel.findOne({
      email: user.email.toLowerCase(),
    });

    if (!checkUser) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    /* Check Password */

    const isValidPassword = await bcrypt.compare(
      user.password,
      checkUser.password,
    );

    if (!isValidPassword) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    /* Generate Token */

    const token = this.jwt.sign({ _id: checkUser._id, email: checkUser.email });

    /* Send Token */

    return { token, _id: checkUser._id };
  }

  async GetProfile(req: Request) {
    const token = req.header('jwt');
    const payload = this.jwt.decode(token);

    const user = await this.userModel.findOne({
      email: payload?.email,
    });

    if (!user) {
      throw new HttpException(
        'The user does not exits!',
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    return user;
  }
}
