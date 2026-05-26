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
  enableReplicaDbAccess: getConfigValueBoolean(
    'EASEY_STREAMING_SERVICES_ENABLE_REPLICA_DB_ACCESS',
  ),
  version: getConfigValue('EASEY_STREAMING_SERVICES_VERSION', 'v0.0.0'),
  published: getConfigValue('EASEY_STREAMING_SERVICES_PUBLISHED', 'local'),
  streamBatchSize: getConfigValueNumber(
    'EASEY_STREAMING_SERVICES_STREAM_BATCH_SIZE',
    20000,
  ),
  // ENABLES DEBUG CONSOLE LOGS
  enableDebug: getConfigValueBoolean('EASEY_STREAMING_SERVICES_ENABLE_DEBUG'),
  apiHost: apiHost,
  authApi: {
    uri: getConfigValue('EASEY_AUTH_API', `https://${apiHost}/auth-mgmt`),
  },
  apiKey: getConfigValue('EASEY_STREAMING_SERVICES_API_KEY'),

  //DB Settings
  maxPoolSize: getConfigValueNumber( 'EASEY_STREAMING_SERVICES_MAX_POOL_SIZE', 200, ),
  idleTimeout: getConfigValueNumber( 'EASEY_STREAMING_SERVICES_IDLE_TIMEOUT', 30000, ),
  connectionTimeout: getConfigValueNumber( 'EASEY_STREAMING_SERVICES_CONNECTION_TIMEOUT', 10000, ),
  statementTimeout: getConfigValueNumber('EASEY_DB_STATEMENT_TIMEOUT',1800000),
  idleInTransactionSessionTimeout: getConfigValueNumber('EASEY_DB_IDLE_TRANS_SESSION_TIMEOUT',300000),
  maxUsesBeforeRecreatingConnection: getConfigValueNumber('EASEY_DB_MAX_USES_BEFORE_CONN_RECREATE',500),

  //TypeORM only, not supported by pg options
  sqlLogging: getConfigValue('EASEY_DB_SQL_LOGGING', "error"),
  maxQueryExecutionTime: getConfigValueNumber('EASEY_DB_MAX_QUERY_EXECUTION_TIMEOUT',30000),

}));
