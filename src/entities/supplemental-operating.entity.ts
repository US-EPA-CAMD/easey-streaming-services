import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { MonitorLocation } from './monitor-location.entity';
import { ReportingPeriod } from './reporting-period.entity';

@Entity({ name: 'camdecmps.operating_supp_data' })
export class SupplementalOperating extends BaseEntity {
  @PrimaryColumn({ name: 'op_supp_data_id' })
  id: string;

  @Column({ name: 'mon_loc_id' })
  locationId: string;

  @Column({
    name: 'rpt_period_id',
    type: 'numeric',
    transformer: new NumericColumnTransformer(),
  })
  reportPeriodId: number;

  @Column({ name: 'op_type_cd' })
  operatingTypeCode: string;

  @Column({ name: 'fuel_cd' })
  fuelCode: string;

  @Column({
    name: 'op_value',
    type: 'numeric',
    transformer: new NumericColumnTransformer(),
  })
  operatingValue: number;

  @Column({ name: 'userid' })
  userId: string;

  @Column({ name: 'add_date' })
  addDate: string;

  @Column({ name: 'update_date' })
  updateDate: string;

  @ManyToOne(
    () => MonitorLocation,
    o => o.summaryValues,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  monitorLocation: MonitorLocation;

  @ManyToOne(
    () => ReportingPeriod,
    o => o.summaryValues,
  )
  @JoinColumn({ name: 'rpt_period_id' })
  reportingPeriod: ReportingPeriod;
}
