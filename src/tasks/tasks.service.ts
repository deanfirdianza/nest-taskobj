import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}
  create(createTaskDto: CreateTaskDto) {
    return 'This action adds a new task';
  }

  async findAll() {
    try {
      return await this.prisma.task.findMany({
        include: {
          owner: {
            select: {
              id: true,
              email: true,
              name: true,
              password: false,
            },
          },
          objectives: true,
        },
      });
    } catch (e) {
      console.log(e);
      throw new HttpException('Failed to get tasks', HttpStatus.CONFLICT);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
