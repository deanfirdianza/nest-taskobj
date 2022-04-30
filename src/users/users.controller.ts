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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma, User } from '@prisma/client';
import { UserEntity } from './entities/user.entity';
import { serialize } from 'class-transformer';
import { FindOneUserParams } from './dto/find-one-user-params.dto';
import { UpdateUserParams } from './dto/update-user-params.dto';
import { DeleteUserParams } from './dto/delete-user-params.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(): Promise<any> {
    const users = await this.usersService.findAll();
    const response = [];
    users.forEach((element) => {
      response.push(new UserEntity(element));
    });
    return response;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/:id')
  async findOne(@Param() params: FindOneUserParams): Promise<UserEntity> {
    return new UserEntity(await this.usersService.findOne(+params.id));
  }

  @Patch(':id')
  update(
    @Param() params: UpdateUserParams,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(+params.id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param() params: DeleteUserParams) {
    return this.usersService.remove(+params.id);
  }
}
