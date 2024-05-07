import { Injectable, StreamableFile } from '@nestjs/common';
import { ExcludeApportionedEmissions } from '@us-epa-camd/easey-common/enums';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { exclude } from '@us-epa-camd/easey-common/utilities';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { Transform } from 'stream';
import { v4 as uuid } from 'uuid';

import { fieldMappings } from '../../constants/emissions-field-mappings';
import { DailyApportionedEmissionsFacilityAggregationDTO } from '../../dto/daily-apportioned-emissions-facility-aggregation.dto';
import { DailyApportionedEmissionsNationalAggregationDTO } from '../../dto/daily-apportioned-emissions-national-aggregation.dto';
import { DailyApportionedEmissionsStateAggregationDTO } from '../../dto/daily-apportioned-emissions-state-aggregation.dto';
import { DailyApportionedEmissionsDTO } from '../../dto/daily-apportioned-emissions.dto';
import {
  DailyApportionedEmissionsParamsDTO,
  StreamDailyApportionedEmissionsParamsDTO,
} from '../../dto/daily-apportioned-emissions.params.dto';
import { StreamingService } from '../../streaming/streaming.service';
import { DayUnitDataRepository } from './day-unit-data.repository';

@Injectable()
export class DailyApportionedEmissionsService {
  constructor(
    private readonly logger: Logger,
    private readonly streamService: StreamingService,
    private readonly repository: DayUnitDataRepository,
  ) {}

  async streamEmissions(
    req: Request,
    params: StreamDailyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    const disposition = `attachment; filename="daily-emissions-${uuid()}`;

    const fieldMappingsList = params.exclude
      ? fieldMappings.emissions.daily.data.aggregation.unit.filter(
          item => !params.exclude.includes(item.value),
        )
      : fieldMappings.emissions.daily.data.aggregation.unit;

    const json2Dto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        data = exclude(data, params, ExcludeApportionedEmissions);
        const dto = plainToClass(DailyApportionedEmissionsDTO, data, {
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
    params: DailyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    const disposition = `attachment; filename="daily-emissions-facility-aggregation-${uuid()}`;

    const fieldMappingsList =
      fieldMappings.emissions.daily.data.aggregation.facility;
    const json2Dto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        const dto = plainToClass(
          DailyApportionedEmissionsFacilityAggregationDTO,
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

    const [sql, values] = this.repository.buildFacilityAggregationQuery(params);

    return this.streamService.getStream(
      req,
      sql,
      values,
      json2Dto,
      disposition,
      fieldMappingsList,
    );
  }

  async streamEmissionsStateAggregation(
    req: Request,
    params: DailyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    const disposition = `attachment; filename="daily-emissions-state-aggregation-${uuid()}`;
    const fieldMappingsList =
      fieldMappings.emissions.daily.data.aggregation.state;

    const json2Dto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        const dto = plainToClass(
          DailyApportionedEmissionsStateAggregationDTO,
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

    const [sql, values] = this.repository.buildStateAggregationQuery(params);

    return this.streamService.getStream(
      req,
      sql,
      values,
      json2Dto,
      disposition,
      fieldMappingsList,
    );
  }

  async streamEmissionsNationalAggregation(
    req: Request,
    params: DailyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    const disposition = `attachment; filename="daily-emissions-national-aggregation-${uuid()}`;
    const fieldMappingsList =
      fieldMappings.emissions.daily.data.aggregation.national;
    const json2Dto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        const dto = plainToClass(
          DailyApportionedEmissionsNationalAggregationDTO,
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
    const [sql, values] = this.repository.buildNationalAggregationQuery(params);

    return this.streamService.getStream(
      req,
      sql,
      values,
      json2Dto,
      disposition,
      fieldMappingsList,
    );
  }
}
