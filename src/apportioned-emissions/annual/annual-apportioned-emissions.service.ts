import { Injectable, StreamableFile } from '@nestjs/common';
import { ExcludeApportionedEmissions } from '@us-epa-camd/easey-common/enums';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { exclude } from '@us-epa-camd/easey-common/utilities';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { Transform } from 'stream';
import { v4 as uuid } from 'uuid';

import { fieldMappings } from '../../constants/emissions-field-mappings';
import { AnnualApportionedEmissionsAggregationDTO } from '../../dto/annual-apportioned-emissions-aggregation.dto';
import { AnnualApportionedEmissionsFacilityAggregationDTO } from '../../dto/annual-apportioned-emissions-facility-aggregation.dto';
import { AnnualApportionedEmissionsDTO } from '../../dto/annual-apportioned-emissions.dto';
import {
  AnnualApportionedEmissionsParamsDTO,
  StreamAnnualApportionedEmissionsParamsDTO,
} from '../../dto/annual-apportioned-emissions.params.dto';
import { StreamingService } from '../../streaming/streaming.service';
import { AnnualApportionedEmissionsStateAggregationDTO } from './../../dto/annual-apportioned-emissions-state-aggregation.dto';
import { AnnualUnitDataRepository } from './annual-unit-data.repository';

@Injectable()
export class AnnualApportionedEmissionsService {
  constructor(
    private readonly logger: Logger,
    private readonly streamService: StreamingService,
    private readonly repository: AnnualUnitDataRepository,
  ) {}

  async streamEmissions(
    req: Request,
    params: StreamAnnualApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    const disposition = `attachment; filename="annual-emissions-${uuid()}`;

    const fieldMappingsList = params.exclude
      ? fieldMappings.emissions.annual.data.aggregation.unit.filter(
          item => !params.exclude.includes(item.value),
        )
      : fieldMappings.emissions.annual.data.aggregation.unit;

    const json2Dto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        data = exclude(data, params, ExcludeApportionedEmissions);
        const dto = plainToClass(AnnualApportionedEmissionsDTO, data, {
          enableImplicitConversion: true,
        });
        callback(null, dto);
      },
    });

    const [sql, values] = await this.repository.buildQuery(
      fieldMappingsList,
      params,
    );

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
    params: AnnualApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    const disposition = `attachment; filename="annual-emissions-facility-aggregation-${uuid()}"`;
    const [sql, values] = this.repository.buildFacilityAggregationQuery(params);

    const fieldMappingsList =
      fieldMappings.emissions.annual.data.aggregation.facility;

    const toDto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        const dto = plainToClass(
          AnnualApportionedEmissionsFacilityAggregationDTO,
          data,
          {
            enableImplicitConversion: true,
          },
        );
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

  async streamEmissionsStateAggregation(
    req: Request,
    params: AnnualApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    const disposition = `attachment; filename="annual-emissions-state-aggregation-${uuid()}`;
    const fieldMappingsList =
      fieldMappings.emissions.annual.data.aggregation.state;

    const json2Dto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        const dto = plainToClass(
          AnnualApportionedEmissionsStateAggregationDTO,
          data,
          {
            enableImplicitConversion: true,
          },
        );
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
    params: AnnualApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    const disposition = `attachment; filename="annual-emissions-national-aggregation-${uuid()}"`;
    const [sql, values] = this.repository.buildNationalAggregationQuery(params);

    const fieldMappingsList =
      fieldMappings.emissions.annual.data.aggregation.national;

    const toDto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        const dto = plainToClass(
          AnnualApportionedEmissionsAggregationDTO,
          data,
          {
            enableImplicitConversion: true,
          },
        );
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
