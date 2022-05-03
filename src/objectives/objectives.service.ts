import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateObjectiveDto } from './dto/create-objective.dto';
import { UpdateObjectiveDto } from './dto/update-objective.dto';

@Injectable()
export class ObjectivesService {
  constructor(private prisma: PrismaService) {}
  create(createObjectiveDto: CreateObjectiveDto) {
    return 'This action adds a new objective';
  }

  findAll() {
    return `This action returns all objectives`;
  }

  async findMany(id) {
    try {
      return await this.prisma.objective.findMany({
        where: {
          taskId: id,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  async findByNameOnTask(taskId, objectiveName) {
    try {
      return await this.prisma.objective.findFirst({
        where: {
          taskId: taskId,
          objectiveName: objectiveName,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} objective`;
  }

  async update(id: number, updateObjectiveDto: UpdateObjectiveDto) {
    return await this.prisma.objective.update({
      where: {
        id: id,
      },
      data: {
        objectiveName: updateObjectiveDto.Objective_Name,
        isFinished: updateObjectiveDto.Is_Finished,
        updatedTime: new Date(),
      },
    });
  }

  async updateByTaskId(id: number, updateObjectiveDto: UpdateObjectiveDto) {
    try {
      const objectiveByMany = await this.prisma.objective.updateMany({
        where: {
          taskId: id,
          objectiveName: updateObjectiveDto.Objective_Name,
        },
        data: {
          isFinished: updateObjectiveDto.Is_Finished,
          updatedTime: new Date(),
        },
      });
      console.log(`objectiveByMany = `, objectiveByMany);
    } catch (e) {
      console.log(e);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} objective`;
  }
}
