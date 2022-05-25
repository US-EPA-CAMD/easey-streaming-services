import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdmd.program_code' })
export class ProgramCode extends BaseEntity {
  @PrimaryColumn({
    name: 'prg_cd',
  })
  programCode: string;

  @Column({
    name: 'prg_description',
  })
  programDescription: string;

  @Column({
    name: 'allowance_ui_filter',
  })
  allowanceUIFilter: number;

  @Column({
    name: 'emissions_ui_filter',
  })
  emissionsUIFilter: number;

  @Column({
    name: 'trading_end_date',
  })
  tradingEndDate: Date;
}
