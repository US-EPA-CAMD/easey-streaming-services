import { Repository, EntityRepository } from 'typeorm';
import { HourlyParamsDto } from '../dto/derived-hourly-value.params.dto';
import { DerivedHrlyValue } from '../entities/derived-hrly-value.entity';

@EntityRepository(DerivedHrlyValue)
export class DerivedHourlyRepository extends Repository<DerivedHrlyValue> {
  private getColumns(): string[] {
    const columns = [];
    columns.push(
      'dh.id',
      'stackPipe.stack_name',
      // 'dh.hourId',
      // 'dh.parameterCode',
      // 'dh.adjustedHourlyValue',
      // 'dh.modcCode',
      // 'dh.locationId',
      // 'dh.reportPeriodId',
      // 'dh.userId',
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

    if (Array.isArray(params.orisCode) && params.orisCode.length > 0) {
      const plantConditions = `p.orisCode IN (${params.orisCode.join(
        ', ',
      )}) AND p.orisCode NOTNULL`;

      query = query
        .innerJoin('ml.monitorPlans', 'mp')
        .innerJoin('mp.plant', 'p', plantConditions);
    }

    if (Array.isArray(params.locationName) && params.locationName.length > 0) {
      const locationStrings = params.locationName
        ?.map(location => `'${location}'`)
        .join(', ');

      const stackPipeCondition = `stackPipe.stack_name IN (${locationStrings})`;
      const unitCondition = `unit.unitid IN (${locationStrings})`;
      const locationCondition = `stackPipe.stack_name IN (${locationStrings}) OR unit.unitid IN (${locationStrings})`;

      query = query
        .leftJoin('ml.stackPipe', 'stackPipe')
        .leftJoin('ml.unit', 'unit')
        .andWhere(locationCondition);

    }

    return query.getQueryAndParameters();
  }
}

