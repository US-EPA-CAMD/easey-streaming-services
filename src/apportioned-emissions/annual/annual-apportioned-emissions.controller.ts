import { Request } from 'express';

import {
  Get,
  Req,
  Query,
  Controller,
  StreamableFile,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOkResponse,
  getSchemaPath,
  ApiSecurity,
  ApiExtraModels,
} from '@nestjs/swagger';

import {
  BadRequestResponse,
  NotFoundResponse,
  ApiQueryEmissionsMultiSelect,
  ApiProgramQuery,
  ExcludeQuery,
  ApiQueryAnnually,
} from '../../utils/swagger-decorator.const';

import { fieldMappings } from '../../constants/emissions-field-mappings';
import { AnnualApportionedEmissionsDTO } from '../../dto/annual-apportioned-emissions.dto';
import { AnnualApportionedEmissionsService } from './annual-apportioned-emissions.service';
import { StreamAnnualApportionedEmissionsParamsDTO } from '../../dto/annual-apportioned-emissions.params.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Apportioned Annual Emissions')
@ApiExtraModels(AnnualApportionedEmissionsDTO)
export class AnnualApportionedEmissionsController {
  
  constructor(private readonly service: AnnualApportionedEmissionsService) { }

  @Get()
  @ApiOkResponse({
    description: 'Streams Annual Apportioned Emissions per filter criteria',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(AnnualApportionedEmissionsDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.annual.map(i => i.label).join(','),
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryEmissionsMultiSelect()
  @ApiQueryAnnually()
  @ApiProgramQuery()
  @ExcludeQuery()
  async streamEmissions(
    @Req() req: Request,
    @Query() params: StreamAnnualApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    return this.service.streamEmissions(req, params);
  }
}
