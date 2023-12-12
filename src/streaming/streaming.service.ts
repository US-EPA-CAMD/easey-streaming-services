import Pool from "pg-pool";
import { Request } from 'express';
import JSONStream from 'JSONStream';
import QueryStream from 'pg-query-stream';
import { ConfigService } from '@nestjs/config';
import { Inject, Injectable, StreamableFile } from '@nestjs/common';

import { Logger } from '@us-epa-camd/easey-common/logger';

import { Json2CSV } from './../transforms/json2csv.transform';

@Injectable()
export class StreamingService {
  private batchSize = this.configService.get<number>('app.streamBatchSize');

  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    @Inject('PG_POOL') private readonly dbPool: Pool,    
  ) { }

  async getStream(
    req: Request,
    sql: string,
    params: any[],
    dtoTransform: any,
    disposition: string,
    fieldMappings: any[],
  ): Promise<StreamableFile> {
    const queryStream = new QueryStream(sql, params, {
      batchSize: this.batchSize,
    });

    const dbClient = await this.dbPool.connect();
    const dbStream = dbClient.query(queryStream).pipe(dtoTransform);

    req.on('close', () => {
      dbClient.release();
      this.logger.log('Client Released');
    });

    req.res.setHeader('X-Field-Mappings', JSON.stringify(fieldMappings));

    if (req.headers.accept === 'text/csv') {
      const json2Csv = new Json2CSV(fieldMappings);
      return new StreamableFile(dbStream.pipe(json2Csv), {
        type: req.headers.accept,
        disposition: `${disposition}.csv`,
      });
    }

    return new StreamableFile(dbStream.pipe(JSONStream.stringify()), {
      type: req.headers.accept,
      disposition: `${disposition}.json`,
    });
  }
}
