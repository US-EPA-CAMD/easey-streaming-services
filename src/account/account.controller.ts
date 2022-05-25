import { Request } from 'express';

import {
  ApiTags,
  ApiSecurity,
  ApiOkResponse,
  getSchemaPath,
  ApiExtraModels,
} from '@nestjs/swagger';

import { Get, Controller, Req, StreamableFile, Query } from '@nestjs/common';

import {
  BadRequestResponse,
  NotFoundResponse,
  ApiQueryAccountMultiSelect,
  ExcludeQuery,
} from '../utils/swagger-decorator.const';

import { AccountService } from './account.service';
import { AccountAttributesDTO } from '../dto/account-attributes.dto';
import { fieldMappings } from '../constants/account-field-mappings';
import { StreamAccountAttributesParamsDTO } from '../dto/account-attributes.params.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Accounts')
@ApiExtraModels(AccountAttributesDTO)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('attributes')
  @ApiOkResponse({
    description: 'Streams All Valid Account Attributes',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(AccountAttributesDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.allowances.accountAttributes.data
            .map(i => i.label)
            .join(','),
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryAccountMultiSelect()
  @ExcludeQuery()
  async streamAllAccountAttributes(
    @Req() req: Request,
    @Query() params: StreamAccountAttributesParamsDTO,
  ): Promise<StreamableFile> {
    return this.accountService.streamAllAccountAttributes(req, params);
  }
}
