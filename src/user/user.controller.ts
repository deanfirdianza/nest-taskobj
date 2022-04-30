import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma, User } from '@prisma/client';
import { UserEntity } from './entities/user.entity';
import { serialize } from 'class-transformer';
import { FindOneUserParams } from './dto/find-one-user-params.user.dto';
import { UpdateUserParams } from './dto/update-user-params.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(): Promise<any> {
    const users = await this.userService.findAll();
    const response = [];
    users.forEach((element) => {
      response.push(new UserEntity(element));
    });
    return response;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/:id')
  async findOne(@Param() params: FindOneUserParams): Promise<UserEntity> {
    return new UserEntity(await this.userService.findOne(+params.id));
  }

  @Patch(':id')
  update(
    @Param() params: UpdateUserParams,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(+params.id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
