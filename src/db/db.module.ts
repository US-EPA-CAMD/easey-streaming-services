require("dotenv").config();

import { Pool } from 'pg';
import { TlsOptions } from "tls";
import { Module } from '@nestjs/common';
import { existsSync, readFileSync } from "fs";
import { ConfigModule, ConfigService } from "@nestjs/config";

const tlsOptions = (host:string) => {
  //if (host === "localhost") return false;
  const options: TlsOptions = { requestCert: true };
  options.rejectUnauthorized = host!== "localhost";
  options.ca = (host !== "localhost" && existsSync('./us-gov-west-1-bundle.pem'))
    ? readFileSync('./us-gov-west-1-bundle.pem').toString()
    : null;
  console.log('TLS/SSL Config (DbModule):', {
    ...options,
    ca: (options.ca !== null)
      ? `${options.ca.slice(0, 30)}...(truncated for display only)`
      : null
  });

  return options;
}

const pgOptions = (configService: ConfigService) => {
  //const host = configService.get<string>('database.host');
  return {
    application_name: configService.get('app.name'),
    user: configService.get('database.user'),
    host: configService.get('database.host'),
    database: configService.get('database.name'),
    password: configService.get('database.pwd'),
    port: configService.get('database.port'),
    max: configService.get('app.maxPoolSize'),
    idleTimeoutMillis: configService.get('app.idleTimeout'),
    connectionTimeoutMillis: configService.get('app.connectionTimeout'),
    maxUses: 500,
    ssl: tlsOptions(configService.get('database.host')),
  };
}

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'PG-OPTIONS',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => pgOptions(configService),
    },
    {
      provide: 'PG-POOL',
      inject: ['PG-OPTIONS'],
      useFactory: (options) => new Pool(options),
    }
  ],
  exports: ['PG-POOL'],
})
export class DbModule {}


