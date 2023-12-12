require("dotenv").config();
const Pool = require("pg-pool");
import { TlsOptions } from "tls";
import { Module } from '@nestjs/common';
import { existsSync, readFileSync } from "fs";
import { ConfigModule, ConfigService } from "@nestjs/config";

const tlsOptions = (host: string) => {
  const options: TlsOptions = { requestCert: true };
  options.rejectUnauthorized = host !== "localhost";
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
  return {
    application_name: configService.get('app.name'),
    user: configService.get('database.user'),
    host: configService.get('database.host'),
    database: configService.get('database.name'),
    password: configService.get('database.pwd'),
    port: configService.get('database.port'),
    // set pool max size to 20
    max: configService.get('app.maxPoolSize'),
    // close idle clients after 1 second
    idleTimeoutMillis: configService.get('app.idleTimeout'),
    // return an error after 1 second if connection could not be established
    connectionTimeoutMillis: configService.get(
      'app.connectionTimeout',
    ),
    // close (and replace) a connection after it has been used 500 times
    maxUses: 500,
    ssl: tlsOptions(configService.get('database.host')),
  };
}

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'PG_OPTIONS',
      inject: [ConfigService],
      useFactory: (configService) => pgOptions(configService),
    },
    {
      provide: 'PG_POOL',
      inject: ['PG_OPTIONS'],
      useFactory: (options) => new Pool(options),
    }
  ],
  exports: ['PG_POOL'],
})
export class DbModule {}
