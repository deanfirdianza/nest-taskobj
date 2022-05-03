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
  ParseIntPipe,
  Put,
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
import { UpdateTaskParams } from './dto/update-task-param.dto';
import { ParamValidationPipe } from '../param-validation.pipe';
import { DeleteTaskParams } from './dto/delete-task-param.dto';

@Controller('task')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private errorHandler: ErrorHandlerService,
    private responseHandler: ResponseHandlerService,
  ) {}

  @UseFilters(HttpExceptionFilter)
  @UsePipes(UnixValidationPipe)
  @Post('/add')
  create(@Body() createTaskDto: CreateTaskDto) {
    try {
      return this.tasksService.create(createTaskDto);
    } catch (e) {
      console.log(e);
      throw new HttpException(
        {
          error: this.errorHandler.errorMessage.idNotFound,
          message: e,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
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
      throw new HttpException(
        this.errorHandler.response(),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseFilters(HttpExceptionFilter)
  @UsePipes(ParseIntPipe)
  @UsePipes(ParamValidationPipe)
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
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseFilters(HttpExceptionFilter)
  @Put('/update/:id')
  update(
    @Param('id', ParseIntPipe) id: UpdateTaskParams,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseFilters(HttpExceptionFilter)
  @Put('/update2/:id')
  update2(
    @Param('id', ParseIntPipe) id: UpdateTaskParams,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update2(+id, updateTaskDto);
  }

  @Delete('/delete/:id')
  remove(@Param() params: DeleteTaskParams) {
    return this.tasksService.remove(+params.id);
  }
}
