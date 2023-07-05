import {
  BaseEntity,
  Column,
  Entity,
  PrimaryColumn,
  JoinColumn,
  OneToOne,
  OneToMany,
  ManyToMany,
} from 'typeorm';

import { Unit } from './unit.entity';
import { StackPipe } from './stack-pipe.entity';
import { MonitorPlan } from './monitor-plan.entity';
import { SummaryValue } from './summary-value.entity';

@Entity({ name: 'camdecmps.monitor_location' })
export class MonitorLocation extends BaseEntity {
  @PrimaryColumn({
    name: 'mon_loc_id',
  })
  id: string;

  @Column({
    name: 'unit_id',
    nullable: true,
  })
  unitId: string;

  @Column({
    name: 'stack_pipe_id',
    nullable: true,
  })
  stackPipeId: string;

  @Column({
    name: 'userid',
    nullable: true,
  })
  userId: string;

  @Column({
    name: 'userid',
    nullable: true,
  })
  addDate: Date;

  @Column({
    name: 'userid',
    nullable: true,
  })
  updateDate: Date;

  @OneToOne(
    () => StackPipe,
    stackPipe => stackPipe.location,
    { eager: true },
  )
  @JoinColumn({ name: 'stack_pipe_id' })
  stackPipe: StackPipe;

  @OneToOne(
    () => Unit,
    unit => unit.monitorLocation,
    { eager: true },
  )
  @JoinColumn({ name: 'unit_id' })
  unit: Unit;

  @ManyToMany(
    () => MonitorPlan,
    plan => plan.locations,
    { eager: true },
  )
  monitorPlans: MonitorPlan[];

  @OneToMany(
    () => SummaryValue,
    c => c.monitorLocation,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  summaryValues: SummaryValue[];
}
