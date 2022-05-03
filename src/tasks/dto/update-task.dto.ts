import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { CreateObjectiveDto } from '../../objectives/dto/create-objective.dto';

export class UpdateTaskDto {
  @IsString()
  Title: string;
  @IsOptional()
  @IsNumber()
  Action_Time: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateObjectiveDto)
  Objective_List: CreateObjectiveDto[];
}
