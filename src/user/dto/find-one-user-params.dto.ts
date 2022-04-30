import { Type } from 'class-transformer';
import { IsInt, IsNumber } from 'class-validator';

export class FindOneUserParams {
  @IsNumber()
  @IsInt()
  @Type(() => Number)
  id: number;
}
