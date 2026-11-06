import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { OrisQuarterParamsDto } from '../dto/summary-value.params.dto';
import { SummaryValue } from '../entities/summary-value.entity';

@Injectable()
export class SummaryValueRepository extends Repository<SummaryValue> {
  constructor(entityManager: EntityManager) {
    super(SummaryValue, entityManager);
  }

  private getColumns(): string[] {
    const columns = [];
    columns.push(
      'sv.id',
      'sv.locationId',
      'sv.reportPeriodId',
      'sv.parameterCode',
      'sv.quarterlyValue',
      'sv.yearTotal',
      'sv.ozoneSeasonTotal',
      'sv.userId',
      'sv.addDate',
      'sv.updateDate',
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

    const query = this.createQueryBuilder('sv')
      .select(this.getColumns())
      .innerJoin(
        'sv.reportingPeriod',
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
      const plantConditions =
        'plant.oris_code IN (:...orisCodes) AND plant.oris_code NOTNULL';
      query
        .innerJoin('sv.monitorLocation', 'ml')
        .leftJoin('ml.unit', 'unit')
        .leftJoin('ml.stackPipe', 'stackPipe')
        .innerJoin('unit.plant', 'plant', plantConditions, {
          orisCodes: params.orisCode,
        });
    }

    return query.getQueryAndParameters();
  }
}
