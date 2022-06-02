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
import { AnnualApportionedEmissionsParamsDTO, StreamAnnualApportionedEmissionsParamsDTO } from '../../dto/annual-apportioned-emissions.params.dto';
import { AnnualApportionedEmissionsAggregationDTO } from 'src/dto/annual-apportioned-emissions-aggregation.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Apportioned Annual Emissions')
@ApiExtraModels(AnnualApportionedEmissionsDTO)
export class AnnualApportionedEmissionsController {
  
  constructor(
    private readonly service: AnnualApportionedEmissionsService
  ) { }

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
          example: fieldMappings.emissions.annual.data.aggregation.unit.map(i => i.label).join(','),
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

  @Get('nationally')
  @ApiOkResponse({
    description: 'Streams Annual Apportioned Emissions data per filter criteria aggregated nationally',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(AnnualApportionedEmissionsAggregationDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.annual.data.aggregation.national.map(i => i.label).join(','),
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryEmissionsMultiSelect()
  @ApiQueryAnnually()
  @ApiProgramQuery()
  async streamEmissionsNationalAggregation(
    @Req() req: Request,
    @Query() params: AnnualApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    return this.service.streamEmissionsNationalAggregation(req, params);
  }


  // @Get('by-facility')
  // @ApiOkResponse({
  //   description:
  //     'Streams Annual Apportioned Emissions data per filter criteria aggregated by facility',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         $ref: getSchemaPath(AnnualApportionedEmissionsFacilityAggregationDTO),
  //       },
  //     },
  //     'text/csv': {
  //       schema: {
  //         type: 'string',
  //         example: fieldMappings.emissions.annual.data.aggregation.facility
  //           .map(i => i.label)
  //           .join(','),
  //       },
  //     },
  //   },
  // })
  // @BadRequestResponse()
  // @NotFoundResponse()
  // @ApiQueryMultiSelect()
  // @ApiProgramQuery()
  // @ApiQueryAnnually()
  // streamEmissionsFacilityAggregation(
  //   @Req() req: Request,
  //   @Query() params: AnnualApportionedEmissionsParamsDTO,
  // ): Promise<StreamableFile> {
  //   return this.service.streamEmissionsFacilityAggregation(req, params);
  // }  
}
