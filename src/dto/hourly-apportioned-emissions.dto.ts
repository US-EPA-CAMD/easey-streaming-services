import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

import { ApportionedEmissionsDTO } from './apportioned-emissions.dto';
import { IsNumber, IsString } from 'class-validator';

export class HourlyApportionedEmissionsDTO extends ApportionedEmissionsDTO {
  constructor() {
    super();
  }

  @ApiProperty({
    description: propertyMetadata.so2MassMeasureFlg.description,
    example: propertyMetadata.so2MassMeasureFlg.example,
    name: propertyMetadata.so2MassMeasureFlg.fieldLabels.value,
  })
  @IsString()
  so2MassMeasureFlg: string;

  @ApiProperty({
    description: propertyMetadata.so2RateMeasureFlg.description,
    example: propertyMetadata.so2RateMeasureFlg.example,
    name: propertyMetadata.so2RateMeasureFlg.fieldLabels.value,
  })
  @IsString()
  so2RateMeasureFlg: string;

  @ApiProperty({
    description: propertyMetadata.noxMassMeasureFlg.description,
    example: propertyMetadata.noxMassMeasureFlg.example,
    name: propertyMetadata.noxMassMeasureFlg.fieldLabels.value,
  })
  @IsString()
  noxMassMeasureFlg: string;

  @ApiProperty({
    description: propertyMetadata.noxRateMeasureFlg.description,
    example: propertyMetadata.noxRateMeasureFlg.example,
    name: propertyMetadata.noxRateMeasureFlg.fieldLabels.value,
  })
  @IsString()
  noxRateMeasureFlg: string;

  @ApiProperty({
    description: propertyMetadata.co2MassMeasureFlg.description,
    example: propertyMetadata.co2MassMeasureFlg.example,
    name: propertyMetadata.co2MassMeasureFlg.fieldLabels.value,
  })
  @IsString()
  co2MassMeasureFlg: string;

  @ApiProperty({
    description: propertyMetadata.co2RateMeasureFlg.description,
    example: propertyMetadata.co2RateMeasureFlg.example,
    name: propertyMetadata.co2RateMeasureFlg.fieldLabels.value,
  })
  @IsString()
  co2RateMeasureFlg: string;

  @ApiProperty({
    description: propertyMetadata.date.description,
    example: propertyMetadata.date.example,
    name: propertyMetadata.date.fieldLabels.value,
  })
  @IsString()
  date: string;

  @IsNumber()
  year: number;

  @ApiProperty({
    description: propertyMetadata.hour.description,
    example: propertyMetadata.hour.example,
    name: propertyMetadata.hour.fieldLabels.value,
  })
  @IsNumber()
  hour: number;

  @ApiProperty({
    description: propertyMetadata.opTime.description,
    example: propertyMetadata.opTime.example,
    name: propertyMetadata.opTime.fieldLabels.value,
  })
  @IsNumber()
  opTime?: number;

  @ApiProperty({
    description: propertyMetadata.unit_id.description,
    example: propertyMetadata.unit_id.example,
    name: propertyMetadata.unit_id.fieldLabels.value,
  })
  @IsNumber()
  unit_id: number
}
