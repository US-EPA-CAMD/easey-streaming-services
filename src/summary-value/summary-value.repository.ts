import { Repository, EntityRepository } from 'typeorm';
import { SummaryValue } from '../entities/summary-value.entity';
import { OrisQuarterParamsDto } from '../dto/summary-value.params.dto';

@EntityRepository(SummaryValue)
export class SummaryValueRepository extends Repository<SummaryValue> {
  private getColumns(): string[] {
    const columns = [];
    columns.push(
      'sv.id',
      'sv.locationId',
      'sv.reportingPeriodId',
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
    const plantConditons = `plant.oris_code IN (${params.orisCode.join(
      ', ',
    )}) AND plant.oris_code NOTNULL`;

    const reportingPeriodConditions = `
        reportingPeriod.calendar_year >= ${params.beginYear} AND
        reportingPeriod.quarter >= ${params.beginQuarter} AND
        reportingPeriod.calendar_year <= ${params.endYear} AND
        reportingPeriod.quarter <= ${params.endQuarter}
      `;

    const query = this.createQueryBuilder('sv')
      .select(this.getColumns())
      .innerJoin('sv.monitorLocation', 'ml')
      .innerJoin('ml.monitorPlans', 'monitorPlans')
      .innerJoin('monitorPlans.plant', 'plant', plantConditons)
      .innerJoin(
        'sv.reportingPeriod',
        'reportingPeriod',
        reportingPeriodConditions,
      );

    return query.getQueryAndParameters();
  }
}
