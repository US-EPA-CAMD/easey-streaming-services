import { registerAs } from '@nestjs/config';
import {
  getConfigValue,
  getConfigValueNumber,
  getConfigValueBoolean,
} from '@us-epa-camd/easey-common/utilities';

require('dotenv').config();

const path = getConfigValue('EASEY_STREAMING_SERVICES_PATH', 'streaming-services');
const host = getConfigValue('EASEY_STREAMING_SERVICES_HOST', 'localhost');
const port = getConfigValueNumber('EASEY_STREAMING_SERVICES_PORT', 8080);

export const TRANSACTION_DATE_LIMIT_YEARS = getConfigValueNumber(
  'EASEY_STREAMING_SERVICES_TRANSACTION_DATE_LIMIT_YEARS', 2,
);

let uri = `https://${host}/${path}`;

if (host === 'localhost') {
  uri = `http://localhost:${port}/${path}`;
}

export default registerAs('app', () => ({
  name: 'streaming-services',
  host, port, path, uri,
  title: getConfigValue(
    'EASEY_STREAMING_SERVICES_TITLE', 'Streaming Services',
  ),
  description: getConfigValue(
    'EASEY_STREAMING_SERVICES_DESCRIPTION',
    'Streaming services API contains endpoints to stream account, allowance, facilities, and emissions data',
  ),
  apiHost: getConfigValue(
    'EASEY_API_GATEWAY_HOST', 'api.epa.gov/easey/dev',
  ),
  env: getConfigValue(
    'EASEY_STREAMING_SERVICES_ENV', 'local-dev',
  ),
  enableCors: getConfigValueBoolean(
    'EASEY_STREAMING_SERVICES_ENABLE_CORS', true,
  ),
  enableApiKey: getConfigValueBoolean(
    'EASEY_STREAMING_SERVICES_ENABLE_API_KEY',
  ),
  enableGlobalValidationPipes: getConfigValueBoolean(
    'EASEY_STREAMING_SERVICES_ENABLE_GLOBAL_VALIDATION_PIPE', true,
  ),
  version: getConfigValue(
    'EASEY_STREAMING_SERVICES_VERSION', 'v0.0.0',
  ),
  published: getConfigValue(
    'EASEY_STREAMING_SERVICES_PUBLISHED', 'local',
  ),
  streamBatchSize: getConfigValueNumber(
    'EASEY_STREAMING_SERVICES_STREAM_BATCH_SIZE', 20000,
  ),
  maxPoolSize: getConfigValueNumber(
    'EASEY_STREAMING_SERVICES_MAX_POOL_SIZE', 200,
  ),
  idleTimeout: getConfigValueNumber(
    'EASEY_STREAMING_SERVICES_IDLE_TIMEOUT', 10000,
  ),
  connectionTimeout: getConfigValueNumber(
    'EASEY_STREAMING_SERVICES_CONNECTION_TIMEOUT', 10000,
  ),
  secretToken: getConfigValue(
    'EASEY_STREAMING_SERVICES_SECRET_TOKEN',
  ),
  enableSecretToken: getConfigValueBoolean(
    'EASEY_STREAMING_SERVICES_ENABLE_SECRET_TOKEN',
  ),
  // ENABLES DEBUG CONSOLE LOGS
  enableDebug: getConfigValueBoolean(
    'EASEY_STREAMING_SERVICES_ENABLE_DEBUG',
  ),
}));
