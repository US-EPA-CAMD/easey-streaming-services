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
} from '../../utils/swagger-decorator.const';

import { fieldMappings } from '../../constants/emissions-field-mappings';
import { DailyApportionedEmissionsDTO } from '../../dto/daily-apportioned-emissions.dto';
import { DailyApportionedEmissionsService } from './daily-apportioned-emissions.service';
import { StreamDailyApportionedEmissionsParamsDTO } from '../../dto/daily-apportioned-emissions.params.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Apportioned Daily Emissions')
@ApiExtraModels(DailyApportionedEmissionsDTO)
export class DailyApportionedEmissionsController {
  
  constructor(
    private readonly service: DailyApportionedEmissionsService
  ) {}

  @Get()
  @ApiOkResponse({
    description: 'Streams Daily Apportioned Emissions per filter criteria',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(DailyApportionedEmissionsDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.daily.map(i => i.label).join(','),
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryEmissionsMultiSelect()
  @ApiProgramQuery()
  @ExcludeQuery()
  async streamEmissions(
    @Req() req: Request,
    @Query() params: StreamDailyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    return this.service.streamEmissions(req, params);
  }

  // @Get('by-facility')
  // @ApiOkResponse({
  //   description:
  //     'Streams Daily Apportioned Emissions data per filter criteria aggregated by facility',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         $ref: getSchemaPath(DailyApportionedEmissionsFacilityAggregationDTO),
  //       },
  //     },
  //     'text/csv': {
  //       schema: {
  //         type: 'string',
  //         example: fieldMappings.emissions.daily.data.aggregation.facility
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
  // streamEmissionsFacilityAggregation(
  //   @Req() req: Request,
  //   @Query() params: DailyApportionedEmissionsParamsDTO,
  // ): Promise<StreamableFile> {
  //   return this.service.streamEmissionsFacilityAggregation(req, params);
  // }

  // @Get('by-state')
  // @ApiOkResponse({
  //   description:
  //     'Streams Daily Apportioned Emissions data per filter criteria aggregated by state',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         $ref: getSchemaPath(DailyApportionedEmissionsStateAggregationDTO),
  //       },
  //     },
  //     'text/csv': {
  //       schema: {
  //         type: 'string',
  //         example: fieldMappings.emissions.daily.data.aggregation.state
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
  // streamEmissionsStateAggregation(
  //   @Req() req: Request,
  //   @Query() params: DailyApportionedEmissionsParamsDTO,
  // ): Promise<StreamableFile> {
  //   return this.service.streamEmissionsStateAggregation(req, params);
  // }

  // @Get('nationally')
  // @ApiOkResponse({
  //   description:
  //     'Streams Daily Apportioned Emissions data per filter criteria aggregated nationally',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         $ref: getSchemaPath(DailyApportionedEmissionsNationalAggregationDTO),
  //       },
  //     },
  //     'text/csv': {
  //       schema: {
  //         type: 'string',
  //         example: fieldMappings.emissions.daily.data.aggregation.national
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
  // streamEmissionsNationalAggregation(
  //   @Req() req: Request,
  //   @Query() params: DailyApportionedEmissionsParamsDTO,
  // ): Promise<StreamableFile> {
  //   return this.service.streamEmissionsNationalAggregation(req, params);
  // }
}
