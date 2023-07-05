import { Repository, EntityRepository } from 'typeorm';
import { SummaryValue } from '../entities/summary-value.entity';
import { SummaryValueParamsDto } from '../dto/summary-value.params.dto';

@EntityRepository(SummaryValue)
export class SummaryValueRepository extends Repository<SummaryValue> {
  async buildQuery(params: SummaryValueParamsDto): Promise<[string, any[]]> {
    const plantConditons = `plant.oris_code IN (${params.orisCode.join(
      ', ',
    )}) AND plant.oris_code NOTNULL`;

    const reportingPeriodConditions = `
        reportingPeriod.calendar_year >= ${params.beginYear} AND
        reportingPeriod.quarter >= ${params.beginQuarter} AND
        reportingPeriod.calendar_year <= ${params.endYear} AND
        reportingPeriod.quarter <= ${params.endQuarter}
      `;

    const query = this.createQueryBuilder('summaryValue')
      .innerJoin('summaryValue.monitorLocation', 'monitorLocation')
      .innerJoin('monitorLocation.monitorPlans', 'monitorPlans')
      .innerJoin('monitorPlans.plant', 'plant', plantConditons)
      .innerJoin(
        'summaryValue.reportingPeriod',
        'reportingPeriod',
        reportingPeriodConditions,
      );

    return query.getQueryAndParameters();
  }
}
