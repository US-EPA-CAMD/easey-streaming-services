import { Injectable, StreamableFile } from '@nestjs/common';
import { ExcludeApportionedEmissions } from '@us-epa-camd/easey-common/enums';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { exclude } from '@us-epa-camd/easey-common/utilities';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { Transform } from 'stream';
import { v4 as uuid } from 'uuid';

import { fieldMappings } from '../../constants/emissions-field-mappings';
import { HourlyApportionedEmissionsFacilityAggregationDTO } from '../../dto/hourly-apportioned-emissions-facility-aggregation.dto';
import { HourlyApportionedEmissionsNationalAggregationDTO } from '../../dto/hourly-apportioned-emissions-national-aggregation.dto';
import { HourlyApportionedEmissionsStateAggregationDTO } from '../../dto/hourly-apportioned-emissions-state-aggregation.dto';
import { HourlyApportionedEmissionsDTO } from '../../dto/hourly-apportioned-emissions.dto';
import {
  HourlyApportionedEmissionsParamsDTO,
  StreamHourlyApportionedEmissionsParamsDTO,
} from '../../dto/hourly-apportioned-emissions.params.dto';
import { StreamingService } from '../../streaming/streaming.service';
import { HourUnitDataRepository } from './hour-unit-data.repository';

@Injectable()
export class HourlyApportionedEmissionsService {
  constructor(
    private readonly logger: Logger,
    private readonly streamService: StreamingService,
    private readonly repository: HourUnitDataRepository,
  ) {}

  async streamEmissions(
    req: Request,
    params: StreamHourlyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    const disposition = `attachment; filename="hourly-emissions-${uuid()}`;

    const fieldMappingsList = params.exclude
      ? fieldMappings.emissions.hourly.data.aggregation.unit.filter(
          item => !params.exclude.includes(item.value),
        )
      : fieldMappings.emissions.hourly.data.aggregation.unit;

    const json2Dto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        data = exclude(data, params, ExcludeApportionedEmissions);
        const dto = plainToClass(HourlyApportionedEmissionsDTO, data, {
          enableImplicitConversion: true,
        });

        const date = new Date(dto.date);
        dto.date = date.toISOString().split('T')[0];
        callback(null, dto);
      },
    });

    const [sql, values] = this.repository.buildQuery(fieldMappingsList, params);

    return this.streamService.getStream(
      req,
      sql,
      values,
      json2Dto,
      disposition,
      fieldMappingsList,
    );
  }

  async streamEmissionsFacilityAggregation(
    req: Request,
    params: HourlyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    const disposition = `attachment; filename="hourly-emissions-facility-aggregation-${uuid()}"`;
    const [sql, values] = this.repository.buildFacilityAggregationQuery(params);
    const toDto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        const dto = plainToClass(
          HourlyApportionedEmissionsFacilityAggregationDTO,
          data,
          {
            enableImplicitConversion: true,
          },
        );
        const date = new Date(dto.date);
        dto.date = date.toISOString().split('T')[0];
        callback(null, dto);
      },
    });

    const fieldMappingsList =
      fieldMappings.emissions.hourly.data.aggregation.facility;

    return this.streamService.getStream(
      req,
      sql,
      values,
      toDto,
      disposition,
      fieldMappingsList,
    );
  }

  async streamEmissionsStateAggregation(
    req: Request,
    params: HourlyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    const disposition = `attachment; filename="hourly-emissions-state-aggregation-${uuid()}"`;

    const [sql, values] = this.repository.buildStateAggregationQuery(params);

    const fieldMappingsList =
      fieldMappings.emissions.hourly.data.aggregation.state;

    const toDto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        const dto = plainToClass(
          HourlyApportionedEmissionsStateAggregationDTO,
          data,
          {
            enableImplicitConversion: true,
          },
        );
        const date = new Date(dto.date);
        dto.date = date.toISOString().split('T')[0];
        callback(null, dto);
      },
    });

    return this.streamService.getStream(
      req,
      sql,
      values,
      toDto,
      disposition,
      fieldMappingsList,
    );
  }

  async streamEmissionsNationalAggregation(
    req: Request,
    params: HourlyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    const disposition = `attachment; filename="hourly-emissions-national-aggregation-${uuid()}"`;
    const [sql, values] = this.repository.buildNationalAggregationQuery(params);

    const fieldMappingsList =
      fieldMappings.emissions.hourly.data.aggregation.national;

    const toDto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        const dto = plainToClass(
          HourlyApportionedEmissionsNationalAggregationDTO,
          data,
          {
            enableImplicitConversion: true,
          },
        );
        const date = new Date(dto.date);
        dto.date = date.toISOString().split('T')[0];
        callback(null, dto);
      },
    });

    return this.streamService.getStream(
      req,
      sql,
      values,
      toDto,
      disposition,
      fieldMappingsList,
    );
  }
}
