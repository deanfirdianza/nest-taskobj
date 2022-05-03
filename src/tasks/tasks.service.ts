import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Objective, Task } from '@prisma/client';
import { ErrorHandlerService } from '../common/helper/error-handler/error-handler.service';
import { PrismaService } from '../prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { FindAllTaskQuery } from './dto/find-all-task-query.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import * as rundef from 'rundef';
import { ObjectivesService } from '../objectives/objectives.service';
import { CreateObjectiveDto } from '../objectives/dto/create-objective.dto';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private errorHandler: ErrorHandlerService,
    private objectiveService: ObjectivesService,
  ) {}
  async create(createTaskDto: CreateTaskDto) {
    try {
      await this.prisma.task
        .create({
          data: {
            title: createTaskDto.Title,
            actionTime: new Date(createTaskDto.Action_Time),
            createdTime: new Date(),
            updatedTime: new Date(),
            ownerId: 2,
          },
        })
        .then((v) => {
          Promise.all(
            createTaskDto.Objective_List.map(async function (element, i) {
              return await this.prisma.objective.create({
                data: {
                  taskId: v.id,
                  objectiveName: element,
                  createdTime: new Date(),
                  updatedTime: new Date(),
                },
              });
            }, this),
          );
        })
        .catch((e) => {
          throw new Error(e);
        });

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

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    try {
      const updateManyObjectives = updateTaskDto.Objective_List;
      let taskPromise;
      // console.log(updateManyObjectives); //Payload Objective_List[]
      if (updateManyObjectives) {
        //Update Objectives Start
        taskPromise = await Promise.all(
          updateManyObjectives.map(async (v, k, a) => {
            // console.log(v); //Log value Objective_List[]
            return await this.objectiveService
              .findByNameOnTask(id, v.Objective_Name)
              .then(async (objective) => {
                // console.log(objective); //Log PreUpdated Objective on DB
                if (objective) {
                  //If combination of objectiveName on payload exists on task
                  return await this.objectiveService
                    .update(objective.id, v)
                    .then((updatedObjective) => {
                      // console.log(updatedObjective); //Log PostUpdated Objective on DB
                      return updatedObjective;
                    });
                }
              })
              .catch((e) => {
                console.log(e);
              });
          }),
        ).then(async (updatedObjective) => {
          let taskStatus = true;
          //Check If All Objectives Finished
          // console.log(updatedObjective);
          await this.objectiveService.findMany(id).then((objectives) => {
            objectives.map((v, k, a) => {
              // console.log(v);
              if (v.isFinished === false) {
                taskStatus = false;
              }
            }, taskStatus);
          });
          return taskStatus;
        });
      }
      const updateObj: any = {
        where: {
          id: id,
        },
        data: {
          title: updateTaskDto.Title,
          actionTime: updateTaskDto.Action_Time
            ? new Date(updateTaskDto.Action_Time)
            : updateTaskDto.Action_Time,
          isFinished: taskPromise,
          updatedTime: new Date(),
        },
      };

      const updatedTask = await this.prisma.task.update(updateObj);
      if (updatedTask) {
        return {
          message: 'Success',
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async remove(id: number) {
    try {
      const deleteObjective = this.prisma.objective.deleteMany({
        where: {
          taskId: id,
        },
      });

      const deleteTask = this.prisma.task.delete({
        where: {
          id: id,
        },
      });

      return await this.prisma
        .$transaction([deleteObjective, deleteTask])
        .then((transaction) => {
          console.log(transaction);
          return {
            message: 'Success',
          };
        });
    } catch (e) {
      console.log(e);
      return Promise.reject(e);
    }
  }
}
