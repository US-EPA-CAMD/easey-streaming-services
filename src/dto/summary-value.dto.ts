import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import moment from 'moment';

export class SummaryValueBaseDTO {
  @IsString()
  id: string;

  @IsString()
  locationId: string;

  @IsNumber()
  reportingPeriodId: number;

  @IsString()
  parameterCode: string;

  @IsNumber()
  quarterlyValue: number;

  @IsNumber()
  yearTotal: number;

  @IsNumber()
  ozoneSeasonTotal: number;

  @IsString()
  userId: string;

  @IsString()
  @Transform(date => moment(new Date(date.value)).format('YYYY/MM/DD HH:mm:ss'))
  addDate: string;

  @IsString()
  @Transform(date => date.value? moment(new Date(date.value)).format('YYYY/MM/DD HH:mm:ss') : null)
  updateDate: string;
}
