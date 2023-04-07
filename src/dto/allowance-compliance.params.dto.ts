import { Transform } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import {
  AllowanceProgram,
  ExcludeAllowanceCompliance,
} from '@us-epa-camd/easey-common/enums';
import {
  IsYearFormat,
  IsInDateRange,
  IsInEnum,
  IsInResponse,
} from '@us-epa-camd/easey-common/pipes';
import { ErrorMessages } from '@us-epa-camd/easey-common/constants';

import { IsAllowanceProgram } from '../pipes/is-allowance-program.pipe';
import { ComplianceParamsDTO } from './compliance.params.dto';
import { fieldMappings } from '../constants/account-field-mappings';

export class AllowanceComplianceParamsDTO extends ComplianceParamsDTO {
  @ApiProperty({
    enum: AllowanceProgram,
    description: propertyMetadata.programCodeInfo.description,
  })
  @IsOptional()
  @IsAllowanceProgram(false, {
    each: true,
    message:
      ErrorMessages.AccountCharacteristics(true, 'programCodeInfo') +
      '?allowanceUIFilter=true',
  })
  @Transform(({ value }) => value.split('|').map(item => item.trim()))
  programCodeInfo?: AllowanceProgram[];

  @ApiProperty({
    isArray: true,
    description: propertyMetadata.year.description,
  })
  @IsOptional()
  @IsYearFormat({
    each: true,
    message: ErrorMessages.MultipleFormat('year', 'YYYY'),
  })
  @IsInDateRange(new Date('1995-01-01'), true, false, false, {
    each: true,
    message: ErrorMessages.DateRange(
      'year',
      true,
      'a year between 1995 and this year',
    ),
  })
  @Transform(({ value }) => value.split('|').map(item => item.trim()))
  @IsArray()
  year?: number[];
}

export class StreamAllowanceComplianceParamsDTO extends AllowanceComplianceParamsDTO {
  @ApiProperty({
    enum: ExcludeAllowanceCompliance,
    description: propertyMetadata.exclude.description,
  })
  @IsOptional()
  @IsInEnum(ExcludeAllowanceCompliance, {
    each: true,
    message: ErrorMessages.RemovableParameter(),
  })
  @IsInResponse(fieldMappings.compliance.allowanceNbpOtc.data, {
    each: true,
    message: ErrorMessages.ValidParameter(),
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  exclude?: ExcludeAllowanceCompliance[];
}
