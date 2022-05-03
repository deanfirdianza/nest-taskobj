import { Expose, Type } from 'class-transformer';
import {
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  Title: string;
  @IsNumber()
  Action_Time: number;

  @MinLength(1, {
    each: true,
  })
  Objective_List: string[];
}
