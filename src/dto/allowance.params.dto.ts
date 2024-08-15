import { ApiProperty } from '@nestjs/swagger';
import {
  ErrorMessages,
  propertyMetadata,
} from '@us-epa-camd/easey-common/constants';
import { AccountType, State } from '@us-epa-camd/easey-common/enums';
import { IsAccountNumber, IsOrisCode } from '@us-epa-camd/easey-common/pipes';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

import { IsAccountType } from '../pipes/is-account-type.pipe';
import { IsStateCode } from '../pipes/is-state-code.pipe';

export class AllowanceParamsDTO {
  @ApiProperty({
    enum: AccountType,
    description: propertyMetadata.accountType.description,
  })
  @IsOptional()
  @IsAccountType({
    each: true,
    message: ErrorMessages.AccountCharacteristics(true, 'accountType'),
  })
  @Transform(({ value }) => value.split('|').map(item => item.trim()))
  accountType?: AccountType[];

  @ApiProperty({
    isArray: true,
    description: propertyMetadata.accountNumber.description,
  })
  @IsOptional()
  @IsAccountNumber({
    each: true,
    message: ErrorMessages.AccountCharacteristics(true, 'accountNumber'),
  })
  @Transform(({ value }) => value.split('|').map(item => item.trim()))
  accountNumber?: string[];

  @ApiProperty({
    isArray: true,
    description: propertyMetadata.facilityId.description,
  })
  @IsOptional()
  @IsOrisCode({
    each: true,
    message: ErrorMessages.AccountCharacteristics(true, 'facilityId'),
  })
  @Transform(({ value }) => value.split('|').map(item => item.trim()))
  facilityId?: number[];

  @ApiProperty({
    enum: State,
    description: propertyMetadata.stateCode.description,
  })
  @IsOptional()
  @IsStateCode({
    each: true,
    message: ErrorMessages.AccountCharacteristics(true, 'stateCode'),
  })
  @Transform(({ value }) => value.split('|').map(item => item.trim()))
  stateCode?: State[];
}
