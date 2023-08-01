import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { MonitorLocation } from './monitor-location.entity';
import { ReportingPeriod } from './reporting-period.entity';
import { DerivedHrlyValue } from './derived-hrly-value.entity';

@Entity({ name: 'camdecmps.hrly_op_data' })
export class HrlyOpData extends BaseEntity {
  @PrimaryColumn({ name: 'hour_id', nullable: false })
  id: string;

  @Column({ name: 'mon_loc_id', nullable: false })
  locationId: string;

  @Column({
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
    nullable: false,
  })
  reportPeriodId: number;

  @Column({ name: 'begin_date', type: 'date', nullable: false })
  beginDate: Date;

  @Column({
    name: 'begin_hour',
    transformer: new NumericColumnTransformer(),
    nullable: false,
  })
  beginHour: number;

  @Column({
    name: 'op_time',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  operatingTime: number;

  @Column({
    name: 'hr_load',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  hourLoad: number;

  @Column({ name: 'load_uom_cd', nullable: true })
  loadUnitsOfMeasureCode: string;

  @Column({ name: 'userid', nullable: true })
  userId: string;

  @Column({ name: 'add_date', nullable: true })
  addDate: Date;

  @Column({ name: 'update_date', nullable: true })
  updateDate: Date;

  @ManyToOne(
    () => MonitorLocation,
    o => o.hrlyOpData,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  monitorLocation: MonitorLocation;

  @ManyToOne(
    () => ReportingPeriod,
    o => o.hrlyOpData,
  )
  @JoinColumn({ name: 'rpt_period_id' })
  reportingPeriod: ReportingPeriod;

  @OneToMany(
    () => DerivedHrlyValue,
    c => c.hrlyOpData,
  )
  @JoinColumn({ name: 'hour_id' })
  derivedHrlyValues: DerivedHrlyValue[];
}
