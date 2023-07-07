import { Repository, EntityRepository } from 'typeorm';
import { HourlyParamsDto } from '../dto/derived-hourly-value.params.dto';
import { HrlyOpData } from '../entities/hrly-op-data.entity';

@EntityRepository(HrlyOpData)
export class HourlyOperatingRepository extends Repository<HrlyOpData> {
  private getColumns(): string[] {
    const columns = [];
    columns.push(
      'ho.id',
      'ho.reportingPeriodId',
      'ho.monitoringLocationId',
      'ho.date',
      'ho.hour',
      'ho.operatingTime',
      'ho.hourLoad',
      'ho.loadRange',
      'ho.commonStackLoadRange',
      'ho.fcFactor',
      'ho.fdFactor',
      'ho.fwFactor',
      'ho.fuelCode',
      'ho.multiFuelFlg',
      'ho.userId',
      'ho.addDate',
      'ho.updateDate',
      'ho.loadUnitsOfMeasureCode',
      'ho.operatingConditionCode',
      'ho.fuelCdList',
      'ho.mhhiIndicator',
      'ho.matsHourLoad',
      'ho.matsStartupShutdownFlag',
    );
    return columns.map(col => {
      return `${col} AS "${col.split('.')[1]}"`;
    });
  }

  async buildQuery(params: HourlyParamsDto): Promise<[string, any[]]> {
    const reportingPeriodConditions = `rp.beginDate BETWEEN '${params.beginDate}' AND '${params.endDate}'`;

    let query = this.createQueryBuilder('ho')
      .select(this.getColumns())
      .innerJoin('ho.monitorLocation', 'ml')
      .innerJoin('ho.reportingPeriod', 'rp', reportingPeriodConditions);

    if (Array.isArray(params.orisCode) && params.orisCode.length > 0) {
      const plantConditions = `plant.orisCode IN (${params.orisCode.join(
        ', ',
      )}) AND plant.orisCode NOTNULL`;

      query = query
        .innerJoin('ml.monitorPlans', 'mp')
        .innerJoin('mp.plant', 'plant', plantConditions);
    }

    if (Array.isArray(params.locationName) && params.locationName.length > 0) {
      const locationStrings = params.locationName
        ?.map(location => `'${location}'`)
        .join(', ');

      const stackPipeCondition = `stackPipe.stack_name IN (${locationStrings})`;
      const unitCondition = `unit.unitid IN (${locationStrings})`;

      query = query
        .leftJoin('ml.stackPipe', 'stackPipe', stackPipeCondition)
        .leftJoin('ml.unit', 'unit', unitCondition);
    }

    return query.getQueryAndParameters();
  }
}
