import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import moment from 'moment';

export class HourlyOperatingDTO {
  @IsString()
  id: string;

  @IsString()
  locationId: string;

  @IsNumber()
  reportPeriodId: number;

  @IsString()
  @Transform(date => moment(new Date(date.value)).format('YYYY-MM-DD'))

  beginDate: Date;

  @IsNumber()
  beginHour: number;

  @IsNumber()
  operatingTime: number;

  @IsNumber()
  hourLoad: number;

  @IsString()
  loadUnitsOfMeasureCode: string;

  @IsString()
  userId: string;
  @IsString()
  @Transform(date => moment(new Date(date.value)).format('YYYY/MM/DD HH:mm:ss'))
  addDate: Date;
  @IsString()
  @Transform(date =>
    date.value
      ? moment(new Date(date.value)).format('YYYY/MM/DD HH:mm:ss')
      : null,
  )
  updateDate: Date;
}
