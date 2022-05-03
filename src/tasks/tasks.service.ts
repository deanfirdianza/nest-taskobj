import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Task } from '@prisma/client';
import { ErrorHandlerService } from '../common/helper/error-handler/error-handler.service';
import { PrismaService } from '../prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { FindAllTaskQuery } from './dto/find-all-task-query.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import * as rundef from 'rundef';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private errorHandler: ErrorHandlerService,
  ) {}
  async create(createTaskDto: CreateTaskDto) {
    try {
      const tasks = await this.prisma.task.create({
        data: {
          title: createTaskDto.Title,
          actionTime: new Date(createTaskDto.Action_Time),
          createdTime: new Date(),
          updatedTime: new Date(),
          ownerId: 2,
        },
      });
      createTaskDto.Objective_List.forEach(async function (element, i) {
        await this.prisma.objective.create({
          data: {
            taskId: tasks.id,
            objectiveName: element,
            createdTime: new Date(),
            updatedTime: new Date(),
          },
        });
      }, this);

      return {
        message: 'Success',
      };
    } catch (e) {
      console.log(e);
    }
  }

  async findAll(query: FindAllTaskQuery) {
    try {
      const prismaObj: any = {
        include: {
          objectives: true,
        },
        where: {
          title: {
            contains: query.Title,
          },
          actionTime: {
            gt: query.Action_Time_Start
              ? new Date(query.Action_Time_Start * 1000)
              : query.Action_Time_Start,
            lt: query.Action_Time_End
              ? new Date(query.Action_Time_End * 1000)
              : query.Action_Time_End,
          },
          isFinished: query.Is_Finished,
        },
        orderBy: {
          id: 'desc',
        },
      };
      const stripedObj = rundef(prismaObj, true, true);
      return await this.prisma.task.findMany(stripedObj);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async findAllPaginate(query: FindAllTaskQuery) {
    try {
      const prismaObj: any = {
        skip: (query.Page - 1) * query.Limit,
        take: query.Limit,
        include: {
          objectives: true,
        },
        where: {
          title: {
            contains: query.Title,
          },
          actionTime: {
            gt: query.Action_Time_Start
              ? new Date(query.Action_Time_Start * 1000)
              : query.Action_Time_Start,
            lt: query.Action_Time_End
              ? new Date(query.Action_Time_End * 1000)
              : query.Action_Time_End,
          },
          isFinished: query.Is_Finished,
        },
        orderBy: {
          id: 'desc',
        },
      };
      const stripedObj = rundef(prismaObj, true, true);
      return await this.prisma.task.findMany(stripedObj);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async findOne(id: number): Promise<Task | null> {
    try {
      return await this.prisma.task.findUnique({
        where: {
          id,
        },
        include: {
          objectives: true,
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
