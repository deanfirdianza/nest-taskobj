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
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskEntity } from './entities/task.entity';
import { ErrorHandlerService } from '../common/helper/error-handler/error-handler.service';

@Controller('task')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private errorHandler: ErrorHandlerService,
  ) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/get')
  async findAll(): Promise<any> {
    const users = await this.tasksService.findAll();
    const response = [];
    users.forEach((element) => {
      response.push(new TaskEntity(element));
    });
    return response;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/get/:id')
  async findOne(@Param('id') id: number): Promise<TaskEntity> {
    if (typeof id !== 'number' && id % 1 !== 0) {
      throw new HttpException(
        this.errorHandler.response(
          this.errorHandler.errorMessage.param,
          this.errorHandler.errorKey.param,
        ),
        HttpStatus.OK,
      );
    }
    try {
      return new TaskEntity(await this.tasksService.findOne(+id));
    } catch (e) {
      throw new HttpException(
        this.errorHandler.response(
          this.errorHandler.errorMessage.idNotFound,
          this.errorHandler.errorKey.idNotFound,
        ),
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
