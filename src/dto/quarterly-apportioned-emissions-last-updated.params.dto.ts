import { IsISO8601, IsOptional, IsArray, } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  propertyMetadata,
  ErrorMessages,
} from '@us-epa-camd/easey-common/constants';
import { StreamQuarterlyApportionedEmissionsParamsDTO } from './quarterly-apportioned-emissions.params.dto';
import {
  IsValidNumber,
} from '@us-epa-camd/easey-common/pipes';
import { IsInValidReportingQuarter } from '../pipes/is-in-valid-reporting-quarter.pipe';
import { OpYearOptional } from '../utils/validator.const';

export class QuarterlyApportionedEmissionsLastUpdatedParamsDTO  extends StreamQuarterlyApportionedEmissionsParamsDTO {
  @ApiProperty({
    description: 'Timestamp for filtering record which add date is after this given timestamp.',
    example: '2025-04-01T12:00:00Z',
  })
  @IsISO8601()
  timestamp: string;

  @ApiProperty({
    isArray: true,
    description: propertyMetadata.year.description,
  })
  @OpYearOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split('|').map((item: string) => item.trim());
    } else if (Array.isArray(value)) {
      return value;
    }
    return value;
  })  
  @IsArray()
  year: number[];
  
  @ApiProperty({
    isArray: true,
    description: propertyMetadata.quarter.description,
  })
  @IsValidNumber(4, {
    each: true,
    message: ErrorMessages.MultipleFormat(
      'quarter',
      'single digit format (ex.1,2,3,4)',
    ),
  })
  @IsInValidReportingQuarter([1, 2, 3], 'year', {
    each: true,
    message: ErrorMessages.DateRange(
      'quarter',
      true,
      `a quarter between 01/01/1995 and the quarter ending on ${ErrorMessages.ReportingQuarter()}`,
    ),
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split('|').map((item: string) => item.trim());
    } else if (Array.isArray(value)) {
      return value;
    }
    return value;
  })
  @IsArray()
  @IsOptional()
  quarter: number[];
}
