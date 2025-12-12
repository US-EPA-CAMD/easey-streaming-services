import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { TransactionFact } from './transaction-fact.entity';

@Entity({ name: 'camddmw.transaction_block_dim' })
export class TransactionBlockDim extends BaseEntity {
  @PrimaryColumn({
    name: 'transaction_block_id',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  transactionBlockId: number;

  @PrimaryColumn({
    name: 'prg_code',
  })
  programCodeInfo: string;

  @Column({
    name: 'transaction_id',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  transactionId: number;

  @Column({
    name: 'start_block',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  startBlock: number;

  @Column({
    name: 'end_block',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  endBlock: number;

  @Column({
    name: 'total_block',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  totalBlock: number;

  @Column({
    name: 'vintage_year',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  vintageYear: number;

  @ManyToOne(
    () => TransactionFact,
    tf => tf.transactionBlockDim,
  )
  @JoinColumn([
    {
      name: 'transaction_id',
      referencedColumnName: 'transactionId',
    },
    {
      name: 'prg_code',
      referencedColumnName: 'programCodeInfo',
    },
  ])
  transactionFact: TransactionFact;
}
