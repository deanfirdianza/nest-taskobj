import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
  HttpException,
  HttpStatus,
  Query,
  UseFilters,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskEntity } from './entities/task.entity';
import { ErrorHandlerService } from '../common/helper/error-handler/error-handler.service';
import { ResponseHandlerService } from '../common/helper/response-handler/response-handler.service';
import { instanceToPlain } from 'class-transformer';
import { FindAllTaskQuery } from './dto/find-all-task-query.dto';
import { HttpExceptionFilter } from '../http-exception.filter';
import { UnixValidationPipe } from '../unix-validation.pipe';
import { FindOneTaskParams } from './dto/find-one-task-param.dto';

@Controller('task')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private errorHandler: ErrorHandlerService,
    private responseHandler: ResponseHandlerService,
  ) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseFilters(HttpExceptionFilter)
  @UsePipes(UnixValidationPipe)
  @Get('/get')
  async findAll(@Query() query: FindAllTaskQuery): Promise<any> {
    try {
      const tasks = await this.tasksService.findAll(query);
      const data = await this.tasksService.findAllPaginate(query);
      const count = Object.keys(tasks).length;
      const response = [];
      data.forEach((element) => {
        response.push(new TaskEntity(element));
      });

      return this.responseHandler.success(
        JSON.stringify(instanceToPlain(response)),
        query.Page,
        query.Limit < count ? query.Limit : count,
        Math.ceil(count / query.Limit),
        count,
      );
    } catch (e) {
      throw new HttpException(this.errorHandler.response(), HttpStatus.OK);
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseFilters(HttpExceptionFilter)
  @UsePipes(ParseIntPipe)
  @Get('/get/:id')
  async findOne(@Param('id') id: FindOneTaskParams): Promise<TaskEntity> {
    try {
      return new TaskEntity(await this.tasksService.findOne(+id));
    } catch (e) {
      throw new HttpException(
        {
          error: this.errorHandler.errorMessage.idNotFound,
          message: e,
        },
        HttpStatus.OK,
      );
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}
