import { IsArray, IsDefined, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsValidNumber,
  IsInEnum,
  IsInResponse,
} from '@us-epa-camd/easey-common/pipes';

import {
  propertyMetadata,
  ErrorMessages,
} from '@us-epa-camd/easey-common/constants';
import { ExcludeApportionedEmissions } from '@us-epa-camd/easey-common/enums';

import { OpYear } from '../utils/validator.const';
import { ApportionedEmissionsParamsDTO } from './apportioned-emissions.params.dto';
import { IsInValidReportingQuarter } from '../pipes/is-in-valid-reporting-quarter.pipe';
import { fieldMappings } from '../constants/emissions-field-mappings';

export class QuarterlyApportionedEmissionsParamsDTO extends ApportionedEmissionsParamsDTO {
  @ApiProperty({
    isArray: true,
    description: propertyMetadata.year.description,
  })
  @OpYear()
  @IsDefined({ message: ErrorMessages.RequiredProperty() })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  @IsArray()
  year: number[];

  @ApiProperty({
    isArray: true,
    description: propertyMetadata.quarter.description,
  })
  @IsDefined({ message: ErrorMessages.RequiredProperty() })
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
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  @IsArray()
  quarter: number[];
}

export class StreamQuarterlyApportionedEmissionsParamsDTO extends QuarterlyApportionedEmissionsParamsDTO {
  @ApiProperty({
    enum: ExcludeApportionedEmissions,
    description: propertyMetadata.exclude.description,
  })
  @IsOptional()
  @IsInEnum(ExcludeApportionedEmissions, {
    each: true,
    message: ErrorMessages.RemovableParameter(),
  })
  @IsInResponse(fieldMappings.emissions.quarterly, {
    each: true,
    message: ErrorMessages.ValidParameter(),
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  exclude?: ExcludeApportionedEmissions[];
}
