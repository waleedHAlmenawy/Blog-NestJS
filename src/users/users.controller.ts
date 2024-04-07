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
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UsePipes(ValidationPipe)
  @Post('register')
  Registration(@Body() user: RegisterDto) {
    return this.usersService.Reg(user);
  }

  @UsePipes(ValidationPipe)
  @Post('login')
  Login(@Body() user: LoginDto, @Res({ passthrough: true }) res) {
    return this.usersService.Log(user, res);
  }
}
