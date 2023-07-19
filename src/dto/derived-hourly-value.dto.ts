export class DerivedHourlyValueBaseDTO {
  id: string;

  hourId: string;

  applicableBiasAdjFactor: number;

  calcUnadjustedHrlyValue: number;

  calcAdjustedHrlyValue: number;

  diluentCapInd: number;

  userId: string;

  addDate?: string;

  updateDate?: string;

  calcPctDiluent: string;

  calcPctMoisture: string;

  calcRataStatus: string;

  calcAppeStatus: string;

  rptPeriodId: number;

  monitorLocationId: string;

  calcFuelFlowTotal: number;

  calcHourMeasureCode: string;

  parameterCode: string;

  modcCode: string;

  unadjustedHourlyValue: number;

  adjustedHourlyValue: number;

  monitoringSystemId: string;

  formulaId: string;

  pctAvailable: number;

  operatingConditionCode: string;

  segmentNum: number;

  fuelCode: string;
}
