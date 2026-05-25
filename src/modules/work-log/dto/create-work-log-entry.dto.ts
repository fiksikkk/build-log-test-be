import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateWorkLogEntryDto {
  @ApiProperty({ example: '2026-05-25' })
  @IsDateString()
  workDate!: string;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  workTypeId!: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  measurementUnitId!: number;

  @ApiProperty({ example: 24 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  volume!: number;

  @ApiProperty({ example: 'Иванов И.И.' })
  @IsString()
  @MaxLength(255)
  workerName!: string;
}
