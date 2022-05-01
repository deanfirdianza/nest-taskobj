import { Expose, Transform, Type } from 'class-transformer';
import { toUnix } from '../../common/helper/date/date.service';
import { UserEntity } from '../../users/entities/user.entity';

export class TaskEntity {
  @Expose({ name: 'Task_ID' })
  id: number;
  @Expose({ name: 'Title' })
  title: string;

  @Expose({ name: 'Action_Time' })
  @Transform(({ value }) => toUnix(value))
  actionTime: number;

  @Expose({ name: 'Created_Time' })
  @Transform(({ value }) => toUnix(value))
  createdTime: number;

  @Expose({ name: 'Updated_Time' })
  @Transform(({ value }) => toUnix(value))
  updatedTime: number;
  @Expose({ name: 'Is_Finished' })
  isFinished: boolean;

  @Type(() => UserEntity)
  owner: UserEntity;

  constructor(entity: any) {
    Object.assign(this, entity);
  }
}
