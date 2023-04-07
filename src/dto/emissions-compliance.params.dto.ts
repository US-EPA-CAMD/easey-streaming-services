import { Transform } from 'class-transformer';
import { IsArray, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  propertyMetadata,
  ErrorMessages,
} from '@us-epa-camd/easey-common/constants';
import {
  IsYearFormat,
  IsInDateRange,
  IsInEnum,
  IsInResponse,
} from '@us-epa-camd/easey-common/pipes';
import { ExcludeEmissionsCompliance } from '@us-epa-camd/easey-common/enums';

import { ComplianceParamsDTO } from './compliance.params.dto';
import { fieldMappings } from '../constants/account-field-mappings';

export class EmissionsComplianceParamsDTO extends ComplianceParamsDTO {
  @ApiProperty({
    isArray: true,
    description: propertyMetadata.year.description,
  })
  @IsOptional()
  @IsYearFormat({
    each: true,
    message: ErrorMessages.MultipleFormat('year', 'YYYY'),
  })
  @IsInDateRange(new Date('1996-01-01'), true, false, false, {
    each: true,
    message: ErrorMessages.DateRange(
      'year',
      true,
      'a year between 1996 and this year',
    ),
  })
  @Transform(({ value }) => value.split('|').map(item => item.trim()))
  @IsArray()
  year?: number[];
}

export class StreamEmissionsComplianceParamsDTO extends EmissionsComplianceParamsDTO {
  @ApiProperty({
    enum: ExcludeEmissionsCompliance,
    description: propertyMetadata.exclude.description,
  })
  @IsOptional()
  @IsInEnum(ExcludeEmissionsCompliance, {
    each: true,
    message: ErrorMessages.RemovableParameter(),
  })
  @IsInResponse(fieldMappings.compliance.emissions.data, {
    each: true,
    message: ErrorMessages.ValidParameter(),
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  exclude?: ExcludeEmissionsCompliance[];
}
