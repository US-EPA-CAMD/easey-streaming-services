import { Repository, EntityRepository } from 'typeorm';
import { OrisQuarterParamsDto } from '../dto/summary-value.params.dto';
import { SupplementalOperating } from '../entities/supplemental-operating.entity';

@EntityRepository(SupplementalOperating)
export class SupplementalOperatingRepository extends Repository<
  SupplementalOperating
> {
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
    let plantConditons = '';
    if (params.orisCode) {
      plantConditons = `plant.oris_code IN (${params.orisCode.join(
        ', ',
      )}) AND plant.oris_code NOTNULL`;
    }

    const reportingPeriodConditions = `
        reportingPeriod.calendar_year >= ${params.beginYear} AND
        reportingPeriod.quarter >= ${params.beginQuarter} AND
        reportingPeriod.calendar_year <= ${params.endYear} AND
        reportingPeriod.quarter <= ${params.endQuarter}
      `;

    const query = this.createQueryBuilder('so')
      .select(this.getColumns())
      .innerJoin('so.monitorLocation', 'ml')
      .innerJoin('ml.monitorPlans', 'monitorPlans');
    if (plantConditons) {
      query.innerJoin('monitorPlans.plant', 'plant', plantConditons);
    }
    query.innerJoin(
      'so.reportingPeriod',
      'reportingPeriod',
      reportingPeriodConditions,
    );

    return query.getQueryAndParameters();
  }
}
