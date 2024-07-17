import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { HourlyParamsDto } from '../dto/derived-hourly-value.params.dto';
import { DerivedHrlyValue } from '../entities/derived-hrly-value.entity';

@Injectable()
export class DerivedHourlyRepository extends Repository<DerivedHrlyValue> {
  constructor(entityManager: EntityManager) {
    super(DerivedHrlyValue, entityManager);
  }

  private getColumns(): string[] {
    const columns = [
      'derv_id AS id',
      'hour_id AS hourId',
      'parameter_cd AS parameterCode',
      'adjusted_hrly_value AS adjustedHourlyValue',
      'modc_cd AS modcCode',
      'mon_loc_id AS locationId',
      'rpt_period_id AS reportPeriodId',
      'userid AS userId',
      'add_date AS addDate',
      'update_date AS updateDate',
    ];
    return columns.map(col => `dhv.${col.split(' AS ')[0]} AS "${col.split(' AS ')[1] || col}"`);
  }

  async buildQuery(params: HourlyParamsDto): Promise<[string, any[]]> {
    let paramCounter = 0;
    const paramValues:any[]=[];
    const query = `
      WITH filtered_locations AS (
        SELECT loc.Mon_Loc_Id, loc.Unit_Id, loc.Stack_Pipe_Id,
               COALESCE(unt.Unitid, stp.Stack_Name) AS Location_Name,
               COALESCE(unt.Fac_Id, stp.Fac_Id) AS Fac_Id
        FROM camdecmps.MONITOR_LOCATION loc
        LEFT JOIN camd.UNIT unt ON unt.Unit_Id = loc.Unit_Id 
        LEFT JOIN camdecmps.STACK_PIPE stp ON stp.Stack_Pipe_Id = loc.Stack_Pipe_Id
        ${params.locationName && params.locationName.length > 0 ? `WHERE COALESCE(unt.Unitid, stp.Stack_Name) = ANY($${++paramCounter})` : ''}
      ),
      filtered_facilities AS (
        SELECT fac.Fac_Id, fac.Oris_Code, fac.Facility_Name
        FROM camd.PLANT fac
        ${params.orisCode && params.orisCode.length > 0 ? `WHERE fac.Oris_Code = ANY($${++paramCounter})` : ''}
      )
      SELECT 
        ${this.getColumns().join(', ')},
        fac.Oris_Code,
        fac.Facility_Name,
        fl.Location_Name,
        hod.Begin_Date AS Op_Date,
        hod.Begin_Hour AS Op_Hour,
        hod.Op_Time,
        dhv.Parameter_Cd,
        dhv.Modc_Cd,
        dhv.Adjusted_Hrly_Value,
        dhv.Unadjusted_Hrly_Value,
        dhv.Applicable_Bias_Adj_Factor,
        fl.Mon_Loc_Id,
        fac.Fac_Id
      FROM filtered_locations fl
      JOIN filtered_facilities fac ON fac.Fac_Id = fl.Fac_Id
      JOIN camdecmps.HRLY_OP_DATA hod ON hod.Mon_Loc_Id = fl.Mon_Loc_Id
      JOIN camdecmps.DERIVED_HRLY_VALUE dhv ON dhv.Hour_Id = hod.Hour_Id
      WHERE 1=1
      ${params.beginDate ? `AND hod.Begin_Date >= $${++paramCounter}` : ''}
      ${params.endDate ? `AND hod.Begin_Date <= $${++paramCounter}` : ''}
    `;

    if (params.locationName && params.locationName.length > 0) {
      paramValues.push(params.locationName);
    }
    if (params.orisCode && params.orisCode.length > 0) {
      paramValues.push(params.orisCode);
    }
    if (params.beginDate) {
      paramValues.push(params.beginDate);
    }
    if (params.endDate) {
      paramValues.push(params.endDate);
    }

    console.log('Full SQL Query:', query);
    console.log('Query Parameters:', paramValues);

    return [query, paramValues];
  }
}
