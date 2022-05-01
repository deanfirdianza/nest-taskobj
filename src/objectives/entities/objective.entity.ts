import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { toUnix } from '../../common/helper/date/date.service';
import { TaskEntity } from '../../tasks/entities/task.entity';

export class ObjectiveEntity {
  @Exclude()
  @Expose({ name: 'Objective_ID' })
  id: number;
  @Expose({ name: 'Objective_Name' })
  objectiveName: string;
  @Expose({ name: 'Is_Finished' })
  isFinished: boolean;

  @Expose({ name: 'Created_Time' })
  @Exclude()
  @Transform(({ value }) => toUnix(value))
  createdTime: number;

  @Expose({ name: 'Updated_Time' })
  @Exclude()
  @Transform(({ value }) => toUnix(value))
  updatedTime: number;

  @Exclude()
  taskId: number;

  @Type(() => TaskEntity)
  task: TaskEntity;

  constructor(entity: any) {
    Object.assign(this, entity);
  }
}
