import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { DerivedHrlyValue } from './derived-hrly-value.entity';

@Entity({ name: 'camdecmps.monitor_system' })
export class MonitorSystem extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 45, name: 'mon_sys_id' })
  id: string;

  @Column({ type: 'varchar', length: 45, nullable: false, name: 'mon_loc_id' })
  monitoringLocationId: string;

  @Column({ type: 'varchar', length: 7, nullable: true, name: 'sys_type_cd' })
  systemTypeCode: string;

  @Column({
    type: 'varchar',
    length: 3,
    nullable: true,
    name: 'system_identifier',
  })
  monitoringSystemId: string;

  @Column({
    type: 'varchar',
    length: 7,
    nullable: false,
    name: 'sys_designation_cd',
  })
  systemDesignationCode: string;

  @Column({ type: 'varchar', length: 7, nullable: false, name: 'fuel_cd' })
  fuelCode: string;

  @Column({ type: 'date', nullable: false, name: 'begin_date' })
  beginDate: Date;

  @Column({ type: 'date', nullable: true, name: 'end_date' })
  endDate: Date;

  @Column({ name: 'begin_hour', transformer: new NumericColumnTransformer() })
  beginHour: number;

  @Column({
    name: 'end_hour',
    nullable: true,
    transformer: new NumericColumnTransformer(),
  })
  endHour: number;

  @Column({ type: 'varchar', nullable: true, length: 25, name: 'userid' })
  userId: string;

  @Column({ nullable: true, name: 'add_date' })
  addDate: Date;

  @Column({ nullable: true, name: 'update_date' })
  updateDate: Date;

  @OneToMany(
    () => DerivedHrlyValue,
    c => c.monitorSystem,
  )
  @JoinColumn({ name: 'mon_sys_id' })
  derivedHrlyValues: DerivedHrlyValue[];
}
