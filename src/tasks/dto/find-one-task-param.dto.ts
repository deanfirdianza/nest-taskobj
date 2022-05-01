import { Type } from 'class-transformer';
import { IsInt, IsNumber } from 'class-validator';

export class FindOneTaskParams {
  @IsNumber()
  @IsInt()
  @Type(() => Number)
  id: number;
}
