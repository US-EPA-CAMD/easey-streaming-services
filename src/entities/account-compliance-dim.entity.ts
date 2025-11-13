import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

import { AccountFact } from './account-fact.entity';

@Entity({ name: 'camddmw.account_compliance_dim' })
export class AccountComplianceDim extends BaseEntity {
  @PrimaryColumn({
    name: 'account_number',
  })
  accountNumber: string;

  @PrimaryColumn({
    name: 'prg_code',
  })
  programCodeInfo: string;

  @PrimaryColumn({
    name: 'op_year',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  year: number;

  @Column({
    name: 'units_affected',
  })
  unitsAffected: string;

  @Column({
    name: 'allocated',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  allocated: number;

  @Column({
    name: 'total_held',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  totalAllowancesHeld: number;

  @Column({
    name: 'banked_held',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  bankedHeld: number;

  @Column({
    name: 'current_held',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  currentHeld: number;

  @Column({
    name: 'comp_year_emiss',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  complianceYearEmissions: number;

  @Column({
    name: 'other_deduct',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  otherDeductions: number;

  @Column({
    name: 'current_deduct',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  currentDeductions: number;

  @Column({
    name: 'deduct_1_1',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  deductOneToOne: number;

  @Column({
    name: 'deduct_2_1',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  deductTwoToOne: number;

  @Column({
    name: 'total_deduct',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  totalAllowancesDeducted: number;

  @Column({
    name: 'carried_over',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  carriedOver: number;

  @Column({
    name: 'excess_emiss',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  excessEmissions: number;

  @Column({
    name: 'total_req_deduct',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  totalRequiredDeductions: number;

  @ManyToOne(
    () => AccountFact,
    af => af.accountComplianceDim,
  )
  @JoinColumn([
    {
      name: 'account_number',
      referencedColumnName: 'accountNumber',
    },
    {
      name: 'prg_code',
      referencedColumnName: 'programCodeInfo',
    },
  ])
  accountFact: AccountFact;
}
