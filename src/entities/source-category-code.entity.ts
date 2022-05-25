import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdmd.source_category_code' })
export class SourceCategoryCode extends BaseEntity {
  @PrimaryColumn({
    name: 'source_category_cd',
  })
  sourceCategoryCode: string;

  @Column({
    name: 'source_category_description',
  })
  sourceCategoryDescription: string;
}