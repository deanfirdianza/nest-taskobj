import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateObjectiveDto {
  @IsString()
  Objective_Name: string;

  @IsOptional()
  @IsBoolean()
  Is_Finished: boolean;
}
