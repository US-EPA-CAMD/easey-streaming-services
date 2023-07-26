import { Transform } from "class-transformer";
import { IsNumber, IsString } from "class-validator";
import moment from "moment";

export class SupplementalOperatingDTO {
  @IsString()
  id: string;

  @IsString()
  locationId: string;

  @IsNumber()
  reportPeriodId: number;

  @IsString()
  operatingTypeCode: string;

  @IsString()
  fuelCode: string;

  @IsNumber()
  operatingValue: number;
  @IsString()
  userId: string;

  @IsString()
  @Transform(date => moment(new Date(date.value)).format('YYYY/MM/DD HH:mm:ss'))
  addDate: string;

  @IsString()
  @Transform(date => date.value? moment(new Date(date.value)).format('YYYY/MM/DD HH:mm:ss') : null)
  updateDate: string;
}
