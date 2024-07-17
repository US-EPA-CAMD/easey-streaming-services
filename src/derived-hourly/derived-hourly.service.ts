import { Injectable, StreamableFile } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { Transform } from 'stream';
import { v4 as uuid } from 'uuid';

import { DerivedHourlyValueBaseDTO } from '../dto/derived-hourly-value.dto';
import { HourlyParamsDto } from '../dto/derived-hourly-value.params.dto';
import { StreamingService } from '../streaming/streaming.service';
import { DerivedHourlyRepository } from './derived-hourly.repository';

@Injectable()
export class DerivedHourlyService {
  constructor(
    private readonly repository: DerivedHourlyRepository,
    private readonly streamingService: StreamingService,
  ) {}

  async streamValues(
    req: Request,
    params: HourlyParamsDto,
  ): Promise<StreamableFile> {
    const disposition = `attachment; filename="derived-hourly-${uuid()}`;

    const json2Dto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        const dto = plainToClass(DerivedHourlyValueBaseDTO, data, {
          enableImplicitConversion: true,
        });
        callback(null, dto);
      },
    });

    const [sql, values] = await this.repository.buildQuery(params);

    console.log('Service received query:', sql.substring(0, 100) + '...');

    return this.streamingService.getStream(
      req,
      sql,
      values,
      json2Dto,
      disposition,
      [],
    );
  } catch (error) {
    // Add this error log
    console.error('Error in streamValues:', error);
    throw error; // Re-throw the error to be handled by the global exception filter
  }
}
