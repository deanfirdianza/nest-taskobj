import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, Prisma } from '@prisma/client';
import { UserEntity } from './entities/user.entity';
import { HashService } from '../common/helper/hash/hash.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private hash: HashService) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const hashPassword: string = JSON.stringify(
        await this.hash.exec(createUserDto.password),
      );

      const user = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          name: createUserDto.name,
          password: hashPassword,
        },
      });

      console.log(user);
      return JSON.parse(`{"message": "Success Create User"}`);
    } catch (e) {
      console.log(e);
      if (e.code === 'P2002') {
        throw new HttpException(
          `There is a unique constraint violation, a new user cannot be created with this ${e.meta.target}`,
          HttpStatus.CONFLICT,
        );
      } else {
        throw new HttpException('Failed to create user', HttpStatus.CONFLICT);
      }
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.prisma.user.findMany();
    } catch (e) {
      console.log(e);
      throw new HttpException('Failed to get users', HttpStatus.CONFLICT);
    }
  }

  async findOne(id: number): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: {
          id,
        },
      });
    } catch (e) {
      console.log(e);
      throw new HttpException('Failed to find user', HttpStatus.CONFLICT);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          email: updateUserDto.email,
          name: updateUserDto.name,
        },
      });

      console.log(user);

      return JSON.parse(`{"message": "Success Update User"}`);
    } catch (e) {
      console.log(e);
      if (e.code === 'P2002') {
        throw new HttpException(
          `There is a unique constraint violation, a user cannot be updated with this ${e.meta.target}`,
          HttpStatus.CONFLICT,
        );
      } else {
        throw new HttpException('Failed to update user', HttpStatus.CONFLICT);
      }
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
