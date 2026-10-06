import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { OrisQuarterParamsDto } from '../dto/summary-value.params.dto';
import { SupplementalOperating } from '../entities/supplemental-operating.entity';

@Injectable()
export class SupplementalOperatingRepository extends Repository<
  SupplementalOperating
> {
  constructor(entityManager: EntityManager) {
    super(SupplementalOperating, entityManager);
  }

  private getColumns(): string[] {
    const columns = [];
    columns.push(
      'so.id',
      'so.locationId',
      'so.reportPeriodId',
      'so.operatingTypeCode',
      'so.fuelCode',
      'so.operatingValue',
      'so.userId',
      'so.addDate',
      'so.updateDate',
    );
    return columns.map(col => {
      return `${col} AS "${col.split('.')[1]}"`;
    });
  }

  async buildQuery(params: OrisQuarterParamsDto): Promise<[string, any[]]> {
    const reportingPeriodConditions = `
        reportingPeriod.calendar_year >= :beginYear AND
        reportingPeriod.quarter >= :beginQuarter AND
        reportingPeriod.calendar_year <= :endYear AND
        reportingPeriod.quarter <= :endQuarter
      `;

    const query = this.createQueryBuilder('so')
      .select(this.getColumns())
      .innerJoin(
        'so.reportingPeriod',
        'reportingPeriod',
        reportingPeriodConditions,
        {
          beginYear: params.beginYear,
          beginQuarter: params.beginQuarter,
          endYear: params.endYear,
          endQuarter: params.endQuarter,
        },
      );

    if (params.orisCode) {
      const plantConditions = 'plant.oris_code IN (:...orisCodes)';
      query
        .innerJoin('so.monitorLocation', 'ml')
        .leftJoin('ml.unit', 'unit')
        .leftJoin('ml.stackPipe', 'stackPipe')
        .innerJoin('unit.plant', 'plant', plantConditions, {
          orisCodes: params.orisCode,
        });
    }

    return query.getQueryAndParameters();
  }
}
