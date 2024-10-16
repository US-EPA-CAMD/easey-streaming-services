import { Injectable, StreamableFile } from '@nestjs/common';
import { ExcludeApportionedEmissions } from '@us-epa-camd/easey-common/enums';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { exclude } from '@us-epa-camd/easey-common/utilities';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { Transform } from 'stream';
import { v4 as uuid } from 'uuid';

import { fieldMappings } from '../../constants/emissions-field-mappings';
import { QuarterlyApportionedEmissionsDTO } from '../../dto/quarterly-apportioned-emissions.dto';
import { StreamQuarterlyApportionedEmissionsParamsDTO } from '../../dto/quarterly-apportioned-emissions.params.dto';
import { StreamingService } from '../../streaming/streaming.service';
import { QuarterlyApportionedEmissionsFacilityAggregationDTO } from './../../dto/quarterly-apportioned-emissions-facility-aggregation.dto';
import { QuarterlyApportionedEmissionsNationalAggregationDTO } from './../../dto/quarterly-apportioned-emissions-national-aggregation.dto';
import { QuarterlyApportionedEmissionsStateAggregationDTO } from './../../dto/quarterly-apportioned-emissions-state-aggregation.dto';
import { QuarterlyApportionedEmissionsParamsDTO } from './../../dto/quarterly-apportioned-emissions.params.dto';
import { QuarterUnitDataRepository } from './quarter-unit-data.repository';

@Injectable()
export class QuarterlyApportionedEmissionsService {
  constructor(
    private readonly logger: Logger,
    private readonly streamService: StreamingService,
    private readonly repository: QuarterUnitDataRepository,
  ) {}

  async streamEmissions(
    req: Request,
    params: StreamQuarterlyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    const disposition = `attachment; filename="quarterly-emissions-${uuid()}`;

    const fieldMappingsList = params.exclude
      ? fieldMappings.emissions.quarterly.data.aggregation.unit.filter(
          item => !params.exclude.includes(item.value),
        )
      : fieldMappings.emissions.quarterly.data.aggregation.unit;

    const json2Dto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        data = exclude(data, params, ExcludeApportionedEmissions);
        const dto = plainToClass(QuarterlyApportionedEmissionsDTO, data, {
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
    params: QuarterlyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    const disposition = `attachment; filename="quarterly-emissions-facility-aggregation-${uuid()}"`;
    const [sql, values] = this.repository.buildFacilityAggregationQuery(params);

    const fieldMappingsList =
      fieldMappings.emissions.quarterly.data.aggregation.facility;

    const toDto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        const dto = plainToClass(
          QuarterlyApportionedEmissionsFacilityAggregationDTO,
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
    params: QuarterlyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    const disposition = `attachment; filename="quarterly-emissions-state-aggregation-${uuid()}"`;
    const [sql, values] = this.repository.buildStateAggregationQuery(params);

    const fieldMappingsList =
      fieldMappings.emissions.quarterly.data.aggregation.state;

    const toDto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        const dto = plainToClass(
          QuarterlyApportionedEmissionsStateAggregationDTO,
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

  async streamEmissionsNationalAggregation(
    req: Request,
    params: QuarterlyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    const disposition = `attachment; filename="quarterly-emissions-national-aggregation-${uuid()}"`;
    const [sql, values] = this.repository.buildNationalAggregationQuery(params);

    const fieldMappingsList =
      fieldMappings.emissions.quarterly.data.aggregation.national;

    const toDto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        const dto = plainToClass(
          QuarterlyApportionedEmissionsNationalAggregationDTO,
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
