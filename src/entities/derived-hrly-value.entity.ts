import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { HrlyOpData } from './hrly-op-data.entity';
import { MonitorSystem } from './monitor-system.entity';
import { MonitorFormula } from './monitor-formula.entity';
import { MonitorLocation } from './monitor-location.entity';
import { ReportingPeriod } from './reporting-period.entity';

@Entity({ name: 'camdecmps.derived_hrly_value' })
export class DerivedHrlyValue extends BaseEntity {
  @PrimaryColumn({ name: 'derv_id', nullable: false })
  id: string;

  @Column({ name: 'hour_id', nullable: false })
  hourId: string;

  @Column({ name: 'parameter_cd', nullable: false })
  parameterCode: string;

  @Column({
    name: 'adjusted_hrly_value',
    transformer: new NumericColumnTransformer(),
    nullable: true,
  })
  adjustedHourlyValue: string;

  @Column({ name: 'modc_cd', nullable: true })
  modcCode: string;

  @Column({ name: 'mon_loc_id', nullable: false })
  locationId: string;

  @Column({
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
    nullable: false,
  })
  reportPeriodId: number;

  @Column({ name: 'userid', nullable: true })
  userId: string;

  @Column({ name: 'add_date', nullable: true })
  addDate: Date;

  @Column({ name: 'update_date', nullable: true })
  updateDate: Date;

  @ManyToOne(
    () => HrlyOpData,
    o => o.derivedHrlyValues,
  )
  @JoinColumn({ name: 'hour_id' })
  hrlyOpData: HrlyOpData;

  @ManyToOne(
    () => MonitorSystem,
    o => o.derivedHrlyValues,
  )
  @JoinColumn({ name: 'mon_sys_id' })
  monitorSystem: MonitorSystem;

  @ManyToOne(
    () => MonitorFormula,
    o => o.derivedHrlyValues,
  )
  @JoinColumn({ name: 'mon_form_id' })
  monitorFormula: MonitorFormula;

  @ManyToOne(
    () => MonitorLocation,
    o => o.derivedHrlyValues,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  monitorLocation: MonitorLocation;

  @ManyToOne(
    () => ReportingPeriod,
    o => o.derivedHrlyValues,
  )
  @JoinColumn({ name: 'rpt_period_id' })
  reportingPeriod: ReportingPeriod;
}
