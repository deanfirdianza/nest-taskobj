import { Type } from 'class-transformer';
import { IsInt, IsNumber } from 'class-validator';

export class DeleteUserParams {
  @IsNumber()
  @IsInt()
  @Type(() => Number)
  id: number;
}
