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
  async findOne(
    @Param('id') id: Prisma.UserWhereUniqueInput,
  ): Promise<UserEntity> {
    return new UserEntity(await this.userService.findOne(+id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
