import { Transform } from 'class-transformer';
import { IsArray, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  propertyMetadata,
  ErrorMessages,
} from '@us-epa-camd/easey-common/constants';
import {
  IsYearFormat,
  IsInEnum,
  IsInResponse,
} from '@us-epa-camd/easey-common/pipes';
import {
  TransactionType,
  AllowanceProgram,
  ExcludeAllowanceTransactions,
} from '@us-epa-camd/easey-common/enums';

import { AllowanceParamsDTO } from './allowance.params.dto';
import {
  TransactionBeginDate,
  TransactionEndDate,
} from '../utils/validator.const';
import { IsAllowanceProgram } from '../pipes/is-allowance-program.pipe';
import { IsTransactionType } from '../pipes/is-transaction-type.pipe';
import { IsYearGreater } from '../pipes/is-year-greater.pipe';
import { fieldMappings } from '../constants/account-field-mappings';

export class AllowanceTransactionsParamsDTO extends AllowanceParamsDTO {
  @ApiProperty({
    enum: AllowanceProgram,
    description: propertyMetadata.programCodeInfo.description,
  })
  @IsOptional()
  @IsAllowanceProgram(false, {
    each: true,
    message:
      ErrorMessages.AccountCharacteristics(true, 'programCodeInfo') +
      '?allowanceUIFilter=true',
  })
  @Transform(({ value }) => value.split('|').map(item => item.trim()))
  programCodeInfo?: AllowanceProgram[];

  @ApiProperty({
    isArray: true,
    description: propertyMetadata.ownerOperatorInfo.description,
  })
  @IsOptional()
  @Transform(({ value }) => value.split('|').map(item => item.trim()))
  @IsArray()
  ownerOperator?: string[];

  @ApiProperty({
    description: propertyMetadata.transactionBeginDate.description,
  })
  @TransactionBeginDate()
  @IsDateString()
  transactionBeginDate: Date;

  @ApiProperty({
    description: propertyMetadata.transactionEndDate.description,
  })
  @TransactionEndDate()
  @IsDateString()
  transactionEndDate: Date;

  @ApiProperty({
    enum: TransactionType,
    description: propertyMetadata.transactionType.description,
  })
  @IsOptional()
  @IsTransactionType({
    each: true,
    message: ErrorMessages.AccountCharacteristics(true, 'transactionType'),
  })
  @Transform(({ value }) => value.split('|').map(item => item.trim()))
  transactionType?: TransactionType[];

  @ApiProperty({
    isArray: true,
    description: propertyMetadata.vintageYear.description,
  })
  @IsOptional()
  @IsYearFormat({
    each: true,
    message: ErrorMessages.MultipleFormat('vintageYear', 'YYYY'),
  })
  @IsYearGreater(1995, {
    each: true,
    message: ErrorMessages.YearRange('vintageYear', '1995'),
  })
  @Transform(({ value }) => value.split('|').map(item => item.trim()))
  @IsArray()
  vintageYear?: number[];
}

export class StreamAllowanceTransactionsParamsDTO extends AllowanceTransactionsParamsDTO {
  @ApiProperty({
    enum: ExcludeAllowanceTransactions,
    description: propertyMetadata.exclude.description,
  })
  @IsOptional()
  @IsInEnum(ExcludeAllowanceTransactions, {
    each: true,
    message: ErrorMessages.RemovableParameter(),
  })
  @IsInResponse(fieldMappings.allowances.transactions.data, {
    each: true,
    message: ErrorMessages.ValidParameter(),
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  exclude?: ExcludeAllowanceTransactions[];
}
