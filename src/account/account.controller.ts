import { Request } from 'express';

import {
  ApiTags,
  ApiSecurity,
} from '@nestjs/swagger';

import {
  Get,
  Controller,
  Req,
  StreamableFile,
} from '@nestjs/common';

import {
  BadRequestResponse,
  NotFoundResponse,
  ApiQueryAccountMultiSelect,
  ExcludeQuery,
} from '../utils/swagger-decorator.const';

import { AccountService } from './account.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Accounts')
export class AccountController {
  constructor(
    private readonly accountService: AccountService
  ) {}

  @Get('attributes')
  // @ApiOkResponse({
  //   description: 'Streams All Valid Account Attributes',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         $ref: getSchemaPath(AccountAttributesDTO),
  //       },
  //     },
  //     'text/csv': {
  //       schema: {
  //         type: 'string',
  //         example: fieldMappings.allowances.accountAttributes.data
  //           .map(i => i.label)
  //           .join(','),
  //       },
  //     },
  //   },
  // })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryAccountMultiSelect()
  @ExcludeQuery()
  streamAccountAttributes(
    @Req() req: Request,
    //@Query() params: StreamAccountAttributesParamsDTO,
  ): Promise<StreamableFile> {
    return; //this.service.streamAccountAttributes(req, params);
  }
}

export default AccountController;