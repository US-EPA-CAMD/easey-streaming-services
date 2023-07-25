import { IsNumber, IsString } from 'class-validator';

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
  quarterlyValue?: number;

  @IsNumber()
  yearTotal?: number;

  @IsNumber()
  ozoneSeasonTotal?: number;

  @IsString()
  userId?: string;

  @IsString()
  addDate?: string;

  @IsString()
  updateDate?: string;
}
