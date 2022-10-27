import { Column, ViewEntity } from 'typeorm';

import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@ViewEntity({
  name: 'camddmw.vw_facility_unit_attributes',
})
export class FacilityUnitAttributes {
  @Column({ name: 'unit_id' })
  id: string;

  @Column({ name: 'op_year', transformer: new NumericColumnTransformer() })
  year: number;

  @Column({ name: 'prg_code_info' })
  programCodeInfo: string;

  @Column({ name: 'primary_rep_info' })
  primaryRepInfo: string;

  @Column({ name: 'state' })
  stateCode: string;

  @Column({ name: 'orispl_code', transformer: new NumericColumnTransformer() })
  facilityId: number;

  @Column({ name: 'facility_name' })
  facilityName: string;

  @Column({ name: 'unitid' })
  unitId: string;

  @Column({ name: 'assoc_stacks' })
  associatedStacks: string;

  @Column({ name: 'epa_region', transformer: new NumericColumnTransformer() })
  epaRegion: number;

  @Column({ name: 'nerc_region' })
  nercRegion: string;

  @Column({ name: 'county' })
  county: string;

  @Column({ name: 'county_code' })
  countyCode: string;

  @Column({ name: 'fips_code' })
  fipsCode: string;

  @Column({ name: 'source_cat' })
  sourceCategory: string;

  @Column({ name: 'latitude', scale: 2, precision: 4, transformer: new NumericColumnTransformer() })
  latitude: number;

  @Column({ name: 'longitude', scale: 2, precision: 4, transformer: new NumericColumnTransformer() })
  longitude: number;

  @Column({ name: 'so2_phase' })
  so2Phase: string;

  @Column({ name: 'nox_phase' })
  noxPhase: string;

  @Column({ name: 'unit_type_info' })
  unitType: string;

  @Column({ name: 'primary_fuel_info' })
  primaryFuelInfo: string;

  @Column({ name: 'secondary_fuel_info' })
  secondaryFuelInfo: string;

  @Column({ name: 'so2_control_info' })
  so2ControlInfo: string;

  @Column({ name: 'nox_control_info' })
  noxControlInfo: string;

  @Column({ name: 'part_control_info' })
  pmControlInfo: string;

  @Column({ name: 'hg_control_info' })
  hgControlInfo: string;

  @Column({ name: 'comr_op_date', type: 'date' })
  commercialOperationDate: Date;

  @Column({ name: 'op_status_info' })
  operatingStatus: string;

  @Column({ name: 'capacity_input', scale: 4, precision: 1, transformer: new NumericColumnTransformer() })
  maxHourlyHIRate: number;

  @Column({ name: 'own_display' })
  ownDisplay: string;

  @Column({ name: 'opr_display' })
  oprDisplay: string;

  @Column({ name: 'generator_id' })
  generatorId: string;

  @Column({ name: 'arp_nameplate_capacity', scale: 3, precision: 1 })
  arpNameplateCapacity: number;

  @Column({ name: 'other_nameplate_capacity', scale: 3, precision: 1 })
  otherNameplateCapacity: number;
}