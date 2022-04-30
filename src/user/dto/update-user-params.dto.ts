import { Type } from 'class-transformer';
import { IsInt, IsNumber } from 'class-validator';

export class UpdateUserParams {
  @IsNumber()
  @IsInt()
  @Type(() => Number)
  id: number;
}
