import { Transform, Type } from 'class-transformer';
import { IsInt, IsNumber, IsNumberString } from 'class-validator';

export class UpdateTaskParams {
  @IsNumber()
  @IsInt()
  @Type(() => Number)
  id: number;
}
