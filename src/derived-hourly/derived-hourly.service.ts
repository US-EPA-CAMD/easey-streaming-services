import { Injectable, StreamableFile } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { Transform, PassThrough, pipeline, Readable } from 'stream';
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
    const disposition = `attachment; filename="derived-hourly-${uuid()}"`;

    const json2Dto = new Transform({
      objectMode: true,
      highWaterMark: 1024,
      transform(data, _enc, callback) {
        try {
          const dto = plainToClass(DerivedHourlyValueBaseDTO, data, {
            enableImplicitConversion: true,
          });
          callback(null, dto);
        } catch (error) {
          callback(error);
        }
      },
    });

    const [sql, values] = await this.repository.buildQuery(params);

    // Ensure the stream returned by getStream is a Readable stream
    const dbStream = await this.streamingService.getStream(
      req,
      sql,
      values,
      json2Dto,
      disposition,
      [],
    ) as unknown as Readable;

    const passThrough = new PassThrough();

    return new Promise<StreamableFile>((resolve, reject) => {
      pipeline(
        dbStream,
        json2Dto,
        passThrough,
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(new StreamableFile(passThrough, {
              type: req.headers.accept,
              disposition: `${disposition}.json`,
            }));
          }
        }
      );
    });
  }
}
