require('dotenv').config();
import { registerAs } from '@nestjs/config';
import {
  getConfigValue,
  getConfigValueNumber,
  getConfigValueBoolean,
} from '@us-epa-camd/easey-common/utilities';

const host = getConfigValue('EASEY_STREAMING_SERVICES_HOST', 'localhost');
const port = getConfigValueNumber('EASEY_STREAMING_SERVICES_PORT', 8080);
const path = getConfigValue(
  'EASEY_STREAMING_SERVICES_PATH',
  'streaming-services',
);

let uri = `https://${host}/${path}`;

if (host === 'localhost') {
  uri = `http://localhost:${port}/${path}`;
}

const apiHost = getConfigValue(
  'EASEY_API_GATEWAY_HOST',
  'api.epa.gov/easey/dev',
);

export default registerAs('app', () => ({
  name: 'streaming-services',
  host,
  port,
  path,
  uri,
  title: getConfigValue('EASEY_STREAMING_SERVICES_TITLE', 'Streaming Services'),
  description: getConfigValue(
    'EASEY_STREAMING_SERVICES_DESCRIPTION',
    'Streaming services API contains endpoints to stream account, allowance, facilities, and emissions data',
  ),
  env: getConfigValue('EASEY_STREAMING_SERVICES_ENV', 'local-dev'),
  enableApiKey: getConfigValueBoolean(
    'EASEY_STREAMING_SERVICES_ENABLE_API_KEY',
  ),
  secretToken: getConfigValue('EASEY_STREAMING_SERVICES_SECRET_TOKEN'),
  enableSecretToken: getConfigValueBoolean(
    'EASEY_STREAMING_SERVICES_ENABLE_SECRET_TOKEN',
  ),
  enableCors: getConfigValueBoolean(
    'EASEY_STREAMING_SERVICES_ENABLE_CORS',
    true,
  ),
  enableGlobalValidationPipes: getConfigValueBoolean(
    'EASEY_STREAMING_SERVICES_ENABLE_GLOBAL_VALIDATION_PIPE',
    true,
  ),
  version: getConfigValue('EASEY_STREAMING_SERVICES_VERSION', 'v0.0.0'),
  published: getConfigValue('EASEY_STREAMING_SERVICES_PUBLISHED', 'local'),
  streamBatchSize: getConfigValueNumber(
    'EASEY_STREAMING_SERVICES_STREAM_BATCH_SIZE',
    20000,
  ),
  maxPoolSize: getConfigValueNumber(
    'EASEY_STREAMING_SERVICES_MAX_POOL_SIZE',
    200,
  ),
  idleTimeout: getConfigValueNumber(
    'EASEY_STREAMING_SERVICES_IDLE_TIMEOUT',
    10000,
  ),
  connectionTimeout: getConfigValueNumber(
    'EASEY_STREAMING_SERVICES_CONNECTION_TIMEOUT',
    10000,
  ),
  // ENABLES DEBUG CONSOLE LOGS
  enableDebug: getConfigValueBoolean('EASEY_STREAMING_SERVICES_ENABLE_DEBUG'),
  apiHost: apiHost,
}));
