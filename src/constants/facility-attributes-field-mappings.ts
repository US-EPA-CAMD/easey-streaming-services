import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

const attributes = [];

attributes.push(
  { ...propertyMetadata.stateCode.fieldLabels },
  { ...propertyMetadata.facilityName.fieldLabels },
  { ...propertyMetadata.facilityId.fieldLabels },
  { ...propertyMetadata.unitId.fieldLabels },
  { ...propertyMetadata.associatedStacks.fieldLabels },
  { ...propertyMetadata.year.fieldLabels },
  { ...propertyMetadata.programCodeInfo.fieldLabels },
  { ...propertyMetadata.epaRegion.fieldLabels },
  { ...propertyMetadata.nercRegion.fieldLabels },
  { ...propertyMetadata.county.fieldLabels },
  { ...propertyMetadata.countyCode.fieldLabels },
  { ...propertyMetadata.fipsCode.fieldLabels },
  { ...propertyMetadata.sourceCategory.fieldLabels },
  { ...propertyMetadata.latitude.fieldLabels },
  { ...propertyMetadata.longitude.fieldLabels },
  { ...propertyMetadata.ownerOperatorInfo.fieldLabels },
  { ...propertyMetadata.so2Phase.fieldLabels },
  { ...propertyMetadata.noxPhase.fieldLabels },
  { ...propertyMetadata.unitType.fieldLabels },
  { ...propertyMetadata.primaryFuelInfo.fieldLabels },
  { ...propertyMetadata.secondaryFuelInfo.fieldLabels },
  { ...propertyMetadata.so2ControlInfo.fieldLabels },
  { ...propertyMetadata.noxControlInfo.fieldLabels },
  { ...propertyMetadata.pmControlInfo.fieldLabels },
  { ...propertyMetadata.hgControlInfo.fieldLabels },
  { ...propertyMetadata.commercialOperationDate.fieldLabels },
  { ...propertyMetadata.operatingStatus.fieldLabels },
  { ...propertyMetadata.maxHourlyHIRate.fieldLabels },
  { ...propertyMetadata.associatedGeneratorsAndNameplateCapacity.fieldLabels },
);

export const fieldMappings = {
  facilities: {
    attributes: attributes,
  },
};