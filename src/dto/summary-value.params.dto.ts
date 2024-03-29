import { ApiProperty } from '@nestjs/swagger';
import { ErrorMessages } from '@us-epa-camd/easey-common/constants';
import {
  IsNotEmptyString,
  IsValidNumber,
  IsYearFormat,
} from '@us-epa-camd/easey-common/pipes';
import { IsInYearAndQuarterRange } from '../pipes/is-in-year-and-quarter-range.pipe';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class OrisQuarterParamsDto {
  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => {
    if (value) {
      return value.split('|').map((item: string) => Number(item.trim()));
    }
  })
  @IsArray()
  @ArrayMinSize(1, { message: ErrorMessages.RequiredProperty() })
  @ArrayMaxSize(6, { message: 'The orisCode array must have at most 6 elements' })

  orisCode: number[];

  @ApiProperty()
  @IsYearFormat({
    each: true,
    message: ErrorMessages.SingleFormat('year', 'YYYY format'),
  })
  @IsNotEmptyString({ message: ErrorMessages.RequiredProperty() })
  @IsInYearAndQuarterRange('quarter', {
    message:
      'The Year and Quarter cannot be before 2009 and cannot surpass the current date',
  })
  beginYear: number;

  @ApiProperty()
  @IsValidNumber(4, {
    each: true,
    message: ErrorMessages.SingleFormat(
      'quarter',
      'single digit format (ex.1,2,3,4)',
    ),
  })
  @IsNotEmptyString({ message: ErrorMessages.RequiredProperty() })
  beginQuarter: number;

  @ApiProperty()
  @IsYearFormat({
    each: true,
    message: ErrorMessages.SingleFormat('year', 'YYYY format'),
  })
  @IsNotEmptyString({ message: ErrorMessages.RequiredProperty() })
  @IsInYearAndQuarterRange('quarter', {
    message:
      'The Year and Quarter cannot be before 2009 and cannot surpass the current date',
  })
  endYear: number;

  @ApiProperty()
  @IsValidNumber(4, {
    each: true,
    message: ErrorMessages.SingleFormat(
      'quarter',
      'single digit format (ex.1,2,3,4)',
    ),
  })
  @IsNotEmptyString({ message: ErrorMessages.RequiredProperty() })
  endQuarter: number;
}
