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
        reportingPeriod.calendar_year >= ${params.beginYear} AND
        reportingPeriod.quarter >= ${params.beginQuarter} AND
        reportingPeriod.calendar_year <= ${params.endYear} AND
        reportingPeriod.quarter <= ${params.endQuarter}
      `;

    const query = this.createQueryBuilder('so')
      .select(this.getColumns())
      .innerJoin(
        'so.reportingPeriod',
        'reportingPeriod',
        reportingPeriodConditions,
      );

    if (params.orisCode) {
      const plantConditions = `plant.oris_code IN (${params.orisCode.join(
        ', ',
      )})`;
      query
        .innerJoin('so.monitorLocation', 'ml')
        .leftJoin('ml.unit', 'unit')
        .leftJoin('ml.stackPipe', 'stackPipe')
        .innerJoin('unit.plant', 'plant', plantConditions);
    }

    return query.getQueryAndParameters();
  }
}
