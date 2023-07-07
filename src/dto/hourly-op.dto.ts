export class HourlyOperatingDTO {
  id: string;
  reportingPeriodId: number;
  monitoringLocationId: string;
  date: Date;
  hour: number;
  operatingTime: number;
  hourLoad: number;
  loadRange: number;
  commonStackLoadRange: number;
  fcFactor: number;
  fdFactor: number;
  fwFactor: number;
  fuelCode: string;
  multiFuelFlg: string;
  userId: string;
  addDate: Date;
  updateDate: Date;
  loadUnitsOfMeasureCode: string;
  operatingConditionCode: string;
  fuelCdList: string;
  mhhiIndicator: number;
  matsHourLoad: number;
  matsStartupShutdownFlag: string;
}
