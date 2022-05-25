import { ApiProperty } from '@nestjs/swagger';

import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

export class FacilityAttributesDTO {
  @ApiProperty({
    description: propertyMetadata.stateCode.description,
    example: propertyMetadata.stateCode.example,
    name: propertyMetadata.stateCode.fieldLabels.value,
  })
  stateCode: string;

  @ApiProperty({
    description: propertyMetadata.facilityName.description,
    example: propertyMetadata.facilityName.example,
    name: propertyMetadata.facilityName.fieldLabels.value,
  })
  facilityName: string;

  @ApiProperty({
    description: propertyMetadata.facilityId.description,
    example: propertyMetadata.facilityId.example,
    name: propertyMetadata.facilityId.fieldLabels.value,
  })
  facilityId?: number;

  @ApiProperty({
    description: propertyMetadata.unitId.description,
    example: propertyMetadata.unitId.example,
    name: propertyMetadata.unitId.fieldLabels.value,
  })
  unitId: string;

  @ApiProperty({
    description: propertyMetadata.associatedStacks.description,
    example: propertyMetadata.associatedStacks.example,
    name: propertyMetadata.associatedStacks.fieldLabels.value,
  })
  associatedStacks: string;

  @ApiProperty({
    description: propertyMetadata.year.description,
    example: propertyMetadata.year.example,
    name: propertyMetadata.year.fieldLabels.value,
  })
  year: number;

  @ApiProperty({
    description: propertyMetadata.programCodeInfo.description,
    example: propertyMetadata.programCodeInfo.example,
    name: propertyMetadata.programCodeInfo.fieldLabels.value,
  })
  programCodeInfo: string;

  @ApiProperty({
    description: propertyMetadata.epaRegion.description,
    example: propertyMetadata.epaRegion.example,
    name: propertyMetadata.epaRegion.fieldLabels.value,
  })
  epaRegion?: number;

  @ApiProperty({
    description: propertyMetadata.nercRegion.description,
    example: propertyMetadata.nercRegion.example,
    name: propertyMetadata.nercRegion.fieldLabels.value,
  })
  nercRegion: string;

  @ApiProperty({
    description: propertyMetadata.county.description,
    example: propertyMetadata.county.example,
    name: propertyMetadata.county.fieldLabels.value,
  })
  county: string;

  @ApiProperty({
    description: propertyMetadata.countyCode.description,
    example: propertyMetadata.countyCode.example,
    name: propertyMetadata.countyCode.fieldLabels.value,
  })
  countyCode: string;

  @ApiProperty({
    description: propertyMetadata.fipsCode.description,
    example: propertyMetadata.fipsCode.example,
    name: propertyMetadata.fipsCode.fieldLabels.value,
  })
  fipsCode: string;

  @ApiProperty({
    description: propertyMetadata.sourceCategory.description,
    example: propertyMetadata.sourceCategory.example,
    name: propertyMetadata.sourceCategory.fieldLabels.value,
  })
  sourceCategory: string;

  @ApiProperty({
    description: propertyMetadata.latitude.description,
    example: propertyMetadata.latitude.example,
    name: propertyMetadata.latitude.fieldLabels.value,
  })
  latitude?: number;

  @ApiProperty({
    description: propertyMetadata.longitude.description,
    example: propertyMetadata.longitude.example,
    name: propertyMetadata.longitude.fieldLabels.value,
  })
  longitude?: number;

  @ApiProperty({
    description: propertyMetadata.ownerOperatorInfo.description,
    example: propertyMetadata.ownerOperatorInfo.example,
    name: propertyMetadata.ownerOperatorInfo.fieldLabels.value,
  })
  ownerOperator: string;

  @ApiProperty({
    description: propertyMetadata.so2Phase.description,
    example: propertyMetadata.so2Phase.example,
    name: propertyMetadata.so2Phase.fieldLabels.value,
  })
  so2Phase: string;

  @ApiProperty({
    description: propertyMetadata.noxPhase.description,
    example: propertyMetadata.noxPhase.example,
    name: propertyMetadata.noxPhase.fieldLabels.value,
  })
  noxPhase: string;

  @ApiProperty({
    description: propertyMetadata.unitType.description,
    example: propertyMetadata.unitType.example,
    name: propertyMetadata.unitType.fieldLabels.value,
  })
  unitType: string;

  @ApiProperty({
    description: propertyMetadata.primaryFuelInfo.description,
    example: propertyMetadata.primaryFuelInfo.example,
    name: propertyMetadata.primaryFuelInfo.fieldLabels.value,
  })
  primaryFuelInfo: string;

  @ApiProperty({
    description: propertyMetadata.secondaryFuelInfo.description,
    example: propertyMetadata.secondaryFuelInfo.example,
    name: propertyMetadata.secondaryFuelInfo.fieldLabels.value,
  })
  secondaryFuelInfo: string;

  @ApiProperty({
    description: propertyMetadata.so2ControlInfo.description,
    example: propertyMetadata.so2ControlInfo.example,
    name: propertyMetadata.so2ControlInfo.fieldLabels.value,
  })
  so2ControlInfo: string;

  @ApiProperty({
    description: propertyMetadata.noxControlInfo.description,
    example: propertyMetadata.noxControlInfo.example,
    name: propertyMetadata.noxControlInfo.fieldLabels.value,
  })
  noxControlInfo: string;

  @ApiProperty({
    description: propertyMetadata.pmControlInfo.description,
    example: propertyMetadata.pmControlInfo.example,
    name: propertyMetadata.pmControlInfo.fieldLabels.value,
  })
  pmControlInfo: string;

  @ApiProperty({
    description: propertyMetadata.hgControlInfo.description,
    example: propertyMetadata.hgControlInfo.example,
    name: propertyMetadata.hgControlInfo.fieldLabels.value,
  })
  hgControlInfo: string;

  @ApiProperty({
    description: propertyMetadata.commercialOperationDate.description,
    example: propertyMetadata.commercialOperationDate.example,
    name: propertyMetadata.commercialOperationDate.fieldLabels.value,
  })
  commercialOperationDate: string;

  @ApiProperty({
    description: propertyMetadata.operatingStatus.description,
    example: propertyMetadata.operatingStatus.example,
    name: propertyMetadata.operatingStatus.fieldLabels.value,
  })
  operatingStatus: string;

  @ApiProperty({
    description: propertyMetadata.maxHourlyHIRate.description,
    example: propertyMetadata.maxHourlyHIRate.example,
    name: propertyMetadata.maxHourlyHIRate.fieldLabels.value,
  })
  maxHourlyHIRate?: number;

  @ApiProperty({
    description:
      propertyMetadata.associatedGeneratorsAndNameplateCapacity.description,
    example: propertyMetadata.associatedGeneratorsAndNameplateCapacity.example,
    name:
      propertyMetadata.associatedGeneratorsAndNameplateCapacity.fieldLabels
        .value,
  })
  associatedGeneratorsAndNamePlateCapacity: string;
}