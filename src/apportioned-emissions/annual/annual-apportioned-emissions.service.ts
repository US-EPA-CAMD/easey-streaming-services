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
import { AnnualUnitDataRepository } from './annual-unit-data.repository';
import { AnnualApportionedEmissionsDTO } from '../../dto/annual-apportioned-emissions.dto';
import { StreamAnnualApportionedEmissionsParamsDTO } from '../../dto/annual-apportioned-emissions.params.dto';

@Injectable()
export class AnnualApportionedEmissionsService {
  
  constructor(
    private readonly logger: Logger,
    private readonly streamService: StreamingService,
    @InjectRepository(AnnualUnitDataRepository)
    private readonly repository: AnnualUnitDataRepository,
  ) {}

  async streamEmissions(
    req: Request,
    params: StreamAnnualApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    const disposition = `attachment; filename="annual-emissions-${uuid()}`;

    const fieldMappingsList = params.exclude
      ? fieldMappings.emissions.annual.filter(
          item => !params.exclude.includes(item.value),
        )
      : fieldMappings.emissions.annual;

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
  //   params: AnnualApportionedEmissionsParamsDTO,
  // ): Promise<StreamableFile> {
  //   try {
  //     const query = this.repository.getFacilityStreamQuery(params);
  //     const stream: ReadStream = await this.streamService.getStream(query);

  //     req.on('close', () => {
  //       stream.emit('end');
  //     });

  //     req.res.setHeader(
  //       fieldMappingHeader,
  //       JSON.stringify(
  //         fieldMappings.emissions.annual.data.aggregation.facility,
  //       ),
  //     );

  //     const toDto = new Transform({
  //       objectMode: true,
  //       transform(data, _enc, callback) {
  //         const dto = plainToClass(
  //           AnnualApportionedEmissionsFacilityAggregationDTO,
  //           data,
  //           {
  //             enableImplicitConversion: true,
  //           },
  //         );
  //         callback(null, dto);
  //       },
  //     });

  //     if (req.headers.accept === 'text/csv') {
  //       const toCSV = new PlainToCSV(
  //         fieldMappings.emissions.annual.data.aggregation.facility,
  //       );
  //       return new StreamableFile(stream.pipe(toDto).pipe(toCSV), {
  //         type: req.headers.accept,
  //         disposition: `attachment; filename="annual-emissions-facility-aggregation-${uuid()}.csv"`,
  //       });
  //     }

  //     const objToString = new PlainToJSON();
  //     return new StreamableFile(stream.pipe(toDto).pipe(objToString), {
  //       type: req.headers.accept,
  //       disposition: `attachment; filename="annual-emissions-facility-aggregation-${uuid()}.json"`,
  //     });
  //   } catch (e) {
  //     console.log(e);
  //     return null;
  //   }
  // }
}
