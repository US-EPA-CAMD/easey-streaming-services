require('dotenv').config();
import { registerAs } from '@nestjs/config';
import { parseBool } from '@us-epa-camd/easey-common/utilities';

const path = process.env.EASEY_STREAMING_SERVICES_PATH || 'streaming-services';
const host = process.env.EASEY_STREAMING_SERVICES_HOST || 'localhost';
const port = +process.env.EASEY_STREAMING_SERVICES_PORT || 8080;

export const TRANSACTION_DATE_LIMIT_YEARS =
  +process.env.EASEY_STREAMING_SERVICES_TRANSACTION_DATE_LIMIT_YEARS || 2;

let uri = `https://${host}/${path}`;

if (host === 'localhost') {
  uri = `http://localhost:${port}/${path}`;
}

export default registerAs('app', () => ({
  name: 'streaming-services',
  title: process.env.EASEY_STREAMING_SERVICES_TITLE || 'Streaming Services',
  description:
    'Streaming services API contains endpoints to stream account, allowance, facilities, and emissions data',
  path,
  host,
  apiHost: process.env.EASEY_API_GATEWAY_HOST || 'api.epa.gov/easey/dev',
  port,
  uri,
  env: process.env.EASEY_STREAMING_SERVICES_ENV || 'local-dev',
  enableCors: parseBool(process.env.EASEY_STREAMING_SERVICES_ENABLE_CORS, true),
  enableApiKey: parseBool(
    process.env.EASEY_STREAMING_SERVICES_ENABLE_API_KEY,
    true,
  ),
  enableAuthToken: parseBool(
    process.env.EASEY_STREAMING_SERVICES_ENABLE_AUTH_TOKEN,
  ),
  enableGlobalValidationPipes: parseBool(
    process.env.EASEY_STREAMING_SERVICES_ENABLE_GLOBAL_VALIDATION_PIPE,
    true,
  ),
  version: process.env.EASEY_STREAMING_SERVICES_VERSION || 'v0.0.0',
  published: process.env.EASEY_STREAMING_SERVICES_PUBLISHED || 'local',
  streamBatchSize:
    +process.env.EASEY_STREAMING_SERVICES_STREAM_BATCH_SIZE || 20000,
  maxPoolSize: +process.env.EASEY_STREAMING_SERVICES_MAX_POOL_SIZE || 200,
  idleTimeout: +process.env.EASEY_STREAMING_SERVICES_IDLE_TIMEOUT || 10000,
  connectionTimeout:
    +process.env.EASEY_STREAMING_SERVICES_CONNECTION_TIMEOUT || 10000,
  enableSecretToken: parseBool(
    process.env.EASEY_STREAMING_SERVICES_ENABLE_SECRET_TOKEN,
    false,
  ),
}));
