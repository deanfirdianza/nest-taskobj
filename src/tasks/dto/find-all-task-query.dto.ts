import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsEmpty,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class FindAllTaskQuery {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  Page: number;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  Limit: number;

  @IsOptional()
  @IsString()
  Title: string;

  @IsOptional()
  @IsNumberString()
  @IsNotEmpty()
  Action_Time_Start: number;

  @IsOptional()
  @IsNumberString()
  @IsNotEmpty()
  Action_Time_End: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  Is_Finished: boolean;
}
