import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/users.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

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
      return { message: 'This email already exists' };
    }

    /* Password Hashing By Bcrypt */

    let salt = await bcrypt.genSalt(10);
    let passwordHashing = await bcrypt.hash(user.password, salt);

    /* Override Password & Email */
    user.password = passwordHashing;
    user.email = user.email.toLowerCase();

    /* Create New Instance From User */

    let newUser = await this.userModel.create(user);
    return { message: 'Added succesfully' };
  }

  async Log(user: LoginDto, res: Response) {
    /* Check Email */

    const checkUser = await this.userModel.findOne({
      email: user.email.toLowerCase(),
    });
    if (!checkUser) {
      return { message: 'Invalid email or password' };
    }

    /* Check Password */

    const isValidPassword = await bcrypt.compare(
      user.password,
      checkUser.password,
    );

    if (!isValidPassword) {
      return { message: 'Invalid email or password' };
    }

    /* Generate Token */

    const token = this.jwt.sign({ _id: checkUser._id, email: checkUser.email });

    /* Set Token in The Header */

    res.header('jwt', token);

    return { message: 'Success' };
  }
}
