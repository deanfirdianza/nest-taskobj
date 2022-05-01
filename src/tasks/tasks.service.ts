import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Task } from '@prisma/client';
import { ErrorHandlerService } from '../common/helper/error-handler/error-handler.service';
import { PrismaService } from '../prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private errorHandler: ErrorHandlerService,
  ) {}
  create(createTaskDto: CreateTaskDto) {
    return 'This action adds a new task';
  }

  async findAll() {
    try {
      return await this.prisma.task.findMany({
        include: {
          owner: true,
          // objectives: true,
        },
      });
    } catch (e) {
      console.log(e);
      throw new HttpException('Failed to get tasks', HttpStatus.CONFLICT);
    }
  }

  async findOne(id: number): Promise<Task | null> {
    try {
      return await this.prisma.task.findUnique({
        where: {
          id,
        },
        rejectOnNotFound: true,
      });
    } catch (e) {
      console.log(e);
      return Promise.reject(e);
    }
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
