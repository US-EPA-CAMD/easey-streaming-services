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
import { OzoneApportionedEmissionsDTO } from '../../dto/ozone-apportioned-emissions.dto';
import { OzoneApportionedEmissionsService } from './ozone-apportioned-emissions.service';
import { OzoneApportionedEmissionsParamsDTO, StreamOzoneApportionedEmissionsParamsDTO } from '../../dto/ozone-apportioned-emissions.params.dto';
import { OzoneApportionedEmissionsFacilityAggregationDTO } from './../../dto/ozone-apportioned-emissions-facility-aggregation.dto';
import { OzoneApportionedEmissionsStateAggregationDTO } from './../../dto/ozone-apportioned-emissions-state-aggregation.dto';
import { OzoneApportionedEmissionsNationalAggregationDTO } from './../../dto/ozone-apportioned-emissions-national-aggregation.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Apportioned Ozone Emissions')
@ApiExtraModels(OzoneApportionedEmissionsDTO)
@ApiExtraModels(OzoneApportionedEmissionsFacilityAggregationDTO)
@ApiExtraModels(OzoneApportionedEmissionsStateAggregationDTO)
@ApiExtraModels(OzoneApportionedEmissionsNationalAggregationDTO)
export class OzoneApportionedEmissionsController {
  
  constructor(
    private readonly service: OzoneApportionedEmissionsService
  ) { }

  @Get()
  @ApiOkResponse({
    description: 'Streams Ozone Apportioned Emissions per filter criteria',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(OzoneApportionedEmissionsDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.ozone.data.aggregation.unit.map(i => i.label).join(','),
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
    @Query() params: StreamOzoneApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    return this.service.streamEmissions(req, params);
  }

  @Get('by-facility')
  @ApiOkResponse({
    description:
      'Streams Ozone Apportioned Emissions data per filter criteria aggregated by facility',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(OzoneApportionedEmissionsFacilityAggregationDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.ozone.data.aggregation.facility
            .map(i => i.label)
            .join(','),
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryEmissionsMultiSelect()
  @ApiProgramQuery()
  @ApiQueryAnnually()
  async streamEmissionsFacilityAggregation(
    @Req() req: Request,
    @Query() params: OzoneApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    return this.service.streamEmissionsFacilityAggregation(req, params);
  }

  @Get('by-state')
  @ApiOkResponse({
    description:
      'Retrieves Ozone Apportioned Emissions data per filter criteria aggregated by state',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(OzoneApportionedEmissionsStateAggregationDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.ozone.data.aggregation.state
            .map(i => i.label)
            .join(','),
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryEmissionsMultiSelect()
  @ApiProgramQuery()
  @ApiQueryAnnually()
  streamEmissionsStateAggregation(
    @Req() req: Request,
    @Query() params: OzoneApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    return this.service.streamEmissionsStateAggregation(req, params);
  }

  @Get('nationally')
  @ApiOkResponse({
    description:
      'Retrieves Ozone Apportioned Emissions data per filter criteria aggregated by nationally',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(OzoneApportionedEmissionsNationalAggregationDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.ozone.data.aggregation.national
            .map(i => i.label)
            .join(','),
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryEmissionsMultiSelect()
  @ApiProgramQuery()
  @ApiQueryAnnually()
  streamEmissionsNationalAggregation(
    @Req() req: Request,
    @Query() params: OzoneApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    return this.service.streamEmissionsNationalAggregation(req, params);
  }
}
