import { IsNumber, IsString } from 'class-validator';

export class SummaryValueBaseDTO {
  @IsString()
  id: string;

  @IsString()
  stackPipeId?: string;

  @IsString()
  unitId?: string;

  @IsString()
  parameterCode: string;

  @IsNumber()
  currentReportingPeriodTotal?: number;

  @IsNumber()
  ozoneSeasonToDateTotal?: number;

  @IsNumber()
  yearToDateTotal?: number;

  @IsNumber()
  reportingPeriodId: number;

  @IsString()
  monitoringLocationId: string;

  @IsNumber()
  calcCurrentRptPeriodTotal?: number;

  @IsNumber()
  calcOsTotal?: number;

  @IsNumber()
  calcYearTotal?: number;

  @IsString()
  userId?: string;

  @IsString()
  addDate?: string;

  @IsString()
  updateDate?: string;
}
