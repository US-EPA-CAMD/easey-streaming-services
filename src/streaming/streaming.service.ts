import { Pool } from 'pg';
import { Request } from 'express';
import JSONStream from 'JSONStream';
import QueryStream from 'pg-query-stream';

import { ConfigService } from '@nestjs/config';

import { Injectable, StreamableFile } from '@nestjs/common';

import { Logger } from '@us-epa-camd/easey-common/logger';

import { Json2CSV } from './../transforms/json2csv.transform';

@Injectable()
export class StreamingService {
  private pool;
  private batchSize = this.configService.get<number>('app.streamBatchSize');

  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {
    this.pool = new Pool({
      user: this.configService.get<string>('database.user'),
      host: this.configService.get<string>('database.host'),
      database: this.configService.get<string>('database.name'),
      password: this.configService.get<string>('database.pwd'),
      port: this.configService.get<number>('database.port'),
      // set pool max size to 20
      max: this.configService.get<number>('app.maxPoolSize'),
      // close idle clients after 1 second
      idleTimeoutMillis: this.configService.get<number>('app.idleTimeout'),
      // return an error after 1 second if connection could not be established
      connectionTimeoutMillis: this.configService.get<number>(
        'app.connectionTimeout',
      ),
      // close (and replace) a connection after it has been used 500 times
      maxUses: 500,
    });
  }

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

    const dbClient = await this.pool.connect();
    const dbStream = dbClient.query(queryStream).pipe(dtoTransform);

    req.on('close', () => {
      dbClient.release();
      this.logger.info('Client Released');
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
