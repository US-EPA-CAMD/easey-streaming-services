import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import {
  propertyMetadata,
  ErrorMessages,
} from '@us-epa-camd/easey-common/constants';

import { IsInEnum, IsInResponse } from '@us-epa-camd/easey-common/pipes';
import { Transform, Type } from 'class-transformer';
import { ExcludeApportionedEmissions } from '@us-epa-camd/easey-common/enums';

import { BeginDate, EndDate } from '../utils/validator.const';
import { ApportionedEmissionsParamsDTO } from './apportioned-emissions.params.dto';
import { fieldMappings } from '../constants/emissions-field-mappings';

export class DailyApportionedEmissionsParamsDTO extends ApportionedEmissionsParamsDTO {
  @ApiProperty({
    description: propertyMetadata.beginDate.description,
  })
  @BeginDate()
  @IsDateString()
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.endDate.description,
  })
  @EndDate()
  @IsDateString()
  endDate: Date;
}

export class StreamDailyApportionedEmissionsParamsDTO extends DailyApportionedEmissionsParamsDTO {
  @ApiProperty({
    enum: ExcludeApportionedEmissions,
    description: propertyMetadata.exclude.description,
  })
  @IsOptional()
  @IsInEnum(ExcludeApportionedEmissions, {
    each: true,
    message: ErrorMessages.RemovableParameter(),
  })
  @IsInResponse(fieldMappings.emissions.daily.data.aggregation.unit, {
    each: true,
    message: ErrorMessages.ValidParameter(),
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  exclude?: ExcludeApportionedEmissions[];
  
  @ApiProperty()
  @IsOptional()
  @IsString()
  unitId?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  unit_id?: number;
}
