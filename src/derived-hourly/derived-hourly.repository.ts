import { Repository, EntityRepository } from 'typeorm';
import { HourlyParamsDto } from '../dto/derived-hourly-value.params.dto';
import { DerivedHrlyValue } from '../entities/derived-hrly-value.entity';

@EntityRepository(DerivedHrlyValue)
export class DerivedHourlyRepository extends Repository<DerivedHrlyValue> {
  private getColumns(): string[] {
    const columns = [];
    columns.push(
      'dh.id',
      'dh.hourId',
      'dh.parameterCode',
      'dh.adjustedHourlyValue',
      'dh.modcCode',
      'dh.locationId',
      'dh.reportPeriodId',
      'dh.userId',
      'dh.addDate',
      'dh.updateDate',
    );
    return columns.map(col => {
      return `${col} AS "${col.split('.')[1]}"`;
    });
  }

  async buildQuery(params: HourlyParamsDto): Promise<[string, any[]]> {
    const reportingPeriodConditions = `rp.beginDate BETWEEN '${params.beginDate}' AND '${params.endDate}'`;

    let query = this.createQueryBuilder('dh')
      .select(this.getColumns())
      .innerJoin('dh.monitorLocation', 'ml')
      .innerJoin('dh.monitorFormula', 'mf')
      .innerJoin('dh.monitorSystem', 'ms')
      .innerJoin('dh.reportingPeriod', 'rp', reportingPeriodConditions);

    const locationNameParams = Array.isArray(params.locationName) && params.locationName.length > 0;
    if (Array.isArray(params.orisCode) && params.orisCode.length > 0 && !locationNameParams) {
      const plantConditions = `p.orisCode IN (${params.orisCode.join(
        ', ',
      )}) AND p.orisCode NOTNULL`;

      query = query
        .innerJoin('ml.monitorPlans', 'mp')
        .innerJoin('mp.plant', 'p', plantConditions);
    }

    if (locationNameParams) {
      const locationStrings = params.locationName
        ?.map(location => `'${location}'`)
        .join(', ');

      const locationCondition = `ml.stackPipe IN (${locationStrings}) OR CAST(ml.unit AS TEXT) IN (${locationStrings})`;

      query = query.andWhere(locationCondition);
    }

    return query.getQueryAndParameters();
  }
}
