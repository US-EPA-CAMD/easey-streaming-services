import { Request } from 'express';
import { v4 as uuid } from 'uuid';
import { Transform } from 'stream';
import { plainToClass } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';

import {
  Injectable,
  StreamableFile,
} from '@nestjs/common';

import { Logger } from '@us-epa-camd/easey-common/logger';
import { exclude } from '@us-epa-camd/easey-common/utilities';
import { ExcludeApportionedEmissions } from '@us-epa-camd/easey-common/enums';

import { fieldMappings } from '../../constants/emissions-field-mappings';
import { StreamingService } from '../../streaming/streaming.service';
import { DayUnitDataRepository } from './day-unit-data.repository';
import { DailyApportionedEmissionsDTO } from '../../dto/daily-apportioned-emissions.dto';
import { StreamDailyApportionedEmissionsParamsDTO } from '../../dto/daily-apportioned-emissions.params.dto';

@Injectable()
export class DailyApportionedEmissionsService {
  
  constructor(
    private readonly logger: Logger,
    private readonly streamService: StreamingService,
    @InjectRepository(DayUnitDataRepository)
    private readonly repository: DayUnitDataRepository,
  ) {}

  async streamEmissions(
    req: Request,
    params: StreamDailyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    const disposition = `attachment; filename="daily-emissions-${uuid()}`;

    const fieldMappingsList = params.exclude
      ? fieldMappings.emissions.daily.filter(
          item => !params.exclude.includes(item.value),
        )
      : fieldMappings.emissions.daily;

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

    const [sql, values] = await this.repository.buildQuery(fieldMappingsList, params);

    return this.streamService.getStream(
      req,
      sql,
      values,
      json2Dto,
      disposition,
      fieldMappingsList,
    );
  }

  // async streamEmissionsFacilityAggregation(
  //   req: Request,
  //   params: DailyApportionedEmissionsParamsDTO,
  // ): Promise<StreamableFile> {
  //   try {
  //     const query = this.repository.getFacilityStreamQuery(params);
  //     const stream: ReadStream = await this.streamService.getStream(query);

  //     req.on('close', () => {
  //       stream.emit('end');
  //     });

  //     req.res.setHeader(
  //       fieldMappingHeader,
  //       JSON.stringify(fieldMappings.emissions.daily.data.aggregation.facility),
  //     );

  //     const toDto = new Transform({
  //       objectMode: true,
  //       transform(data, _enc, callback) {
  //         const dto = plainToClass(
  //           DailyApportionedEmissionsFacilityAggregationDTO,
  //           data,
  //           {
  //             enableImplicitConversion: true,
  //           },
  //         );
  //         const date = new Date(dto.date);
  //         dto.date = date.toISOString().split('T')[0];
  //         callback(null, dto);
  //       },
  //     });

  //     if (req.headers.accept === 'text/csv') {
  //       const toCSV = new PlainToCSV(
  //         fieldMappings.emissions.daily.data.aggregation.facility,
  //       );
  //       return new StreamableFile(stream.pipe(toDto).pipe(toCSV), {
  //         type: req.headers.accept,
  //         disposition: `attachment; filename="daily-emissions-facility-aggregation-${uuid()}.csv"`,
  //       });
  //     }

  //     const objToString = new PlainToJSON();
  //     return new StreamableFile(stream.pipe(toDto).pipe(objToString), {
  //       type: req.headers.accept,
  //       disposition: `attachment; filename="daily-emissions-facility-aggregation-${uuid()}.json"`,
  //     });
  //   } catch (e) {
  //     console.log(e);
  //     return null;
  //   }
  // }

  // async streamEmissionsStateAggregation(
  //   req: Request,
  //   params: DailyApportionedEmissionsParamsDTO,
  // ): Promise<StreamableFile> {
  //   try {
  //     const query = this.repository.getStateStreamQuery(params);
  //     const stream: ReadStream = await this.streamService.getStream(query);

  //     req.on('close', () => {
  //       stream.emit('end');
  //     });

  //     req.res.setHeader(
  //       fieldMappingHeader,
  //       JSON.stringify(fieldMappings.emissions.daily.data.aggregation.state),
  //     );

  //     const toDto = new Transform({
  //       objectMode: true,
  //       transform(data, _enc, callback) {
  //         const dto = plainToClass(
  //           DailyApportionedEmissionsStateAggregationDTO,
  //           data,
  //           {
  //             enableImplicitConversion: true,
  //           },
  //         );
  //         const date = new Date(dto.date);
  //         dto.date = date.toISOString().split('T')[0];
  //         callback(null, dto);
  //       },
  //     });

  //     if (req.headers.accept === 'text/csv') {
  //       const toCSV = new PlainToCSV(
  //         fieldMappings.emissions.daily.data.aggregation.state,
  //       );
  //       return new StreamableFile(stream.pipe(toDto).pipe(toCSV), {
  //         type: req.headers.accept,
  //         disposition: `attachment; filename="daily-emissions-state-aggregation-${uuid()}.csv"`,
  //       });
  //     }

  //     const objToString = new PlainToJSON();
  //     return new StreamableFile(stream.pipe(toDto).pipe(objToString), {
  //       type: req.headers.accept,
  //       disposition: `attachment; filename="daily-emissions-state-aggregation-${uuid()}.json"`,
  //     });
  //   } catch (e) {
  //     console.log(e);
  //     return null;
  //   }
  // }

  // async streamEmissionsNationalAggregation(
  //   req: Request,
  //   params: DailyApportionedEmissionsParamsDTO,
  // ): Promise<StreamableFile> {
  //   try {
  //     const query = this.repository.getNationalStreamQuery(params);
  //     const stream: ReadStream = await this.streamService.getStream(query);

  //     req.on('close', () => {
  //       stream.emit('end');
  //     });

  //     req.res.setHeader(
  //       'X-Field-Mappings',
  //       JSON.stringify(fieldMappings.emissions.daily.data.aggregation.national),
  //     );

  //     const toDto = new Transform({
  //       objectMode: true,
  //       transform(data, _enc, callback) {
  //         const dto = plainToClass(
  //           DailyApportionedEmissionsNationalAggregationDTO,
  //           data,
  //           {
  //             enableImplicitConversion: true,
  //           },
  //         );
  //         const date = new Date(dto.date);
  //         dto.date = date.toISOString().split('T')[0];
  //         callback(null, dto);
  //       },
  //     });

  //     if (req.headers.accept === 'text/csv') {
  //       const toCSV = new PlainToCSV(
  //         fieldMappings.emissions.daily.data.aggregation.national,
  //       );
  //       return new StreamableFile(stream.pipe(toDto).pipe(toCSV), {
  //         type: req.headers.accept,
  //         disposition: `attachment; filename="daily-emissions-national-aggregation-${uuid()}.csv"`,
  //       });
  //     }

  //     const objToString = new PlainToJSON();
  //     return new StreamableFile(stream.pipe(toDto).pipe(objToString), {
  //       type: req.headers.accept,
  //       disposition: `attachment; filename="daily-emissions-national-aggregation-${uuid()}.json"`,
  //     });
  //   } catch (e) {
  //     console.log(e);
  //     return null;
  //   }
  // }
}
