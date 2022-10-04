# Streaming Servcies

[![License](https://img.shields.io/github/license/US-EPA-CAMD/easey-streaming-services)](https://github.com/US-EPA-CAMD/easey-streaming-services/blob/develop/LICENSE)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=US-EPA-CAMD_easey-streaming-services&metric=alert_status)](https://sonarcloud.io/dashboard?id=US-EPA-CAMD_easey-streaming-services)
[![Develop CI/CD](https://github.com/US-EPA-CAMD/easey-streaming-services/workflows/Develop%20Branch%20Workflow/badge.svg)](https://github.com/US-EPA-CAMD/easey-streaming-services/actions)
[![Release CI/CD](https://github.com/US-EPA-CAMD/easey-streaming-services/workflows/Release%20Branch%20Workflow/badge.svg)](https://github.com/US-EPA-CAMD/easey-streaming-services/actions)
![Issues](https://img.shields.io/github/issues/US-EPA-CAMD/easey-streaming-services)
![Forks](https://img.shields.io/github/forks/US-EPA-CAMD/easey-streaming-services)
![Stars](https://img.shields.io/github/stars/US-EPA-CAMD/easey-streaming-services)
[![Open in Visual Studio Code](https://open.vscode.dev/badges/open-in-vscode.svg)](https://open.vscode.dev/US-EPA-CAMD/easey-streaming-services)

## Description
Streaming services for large datasets of Facility, Account, Compliance, & Emissions data.

## Getting Started
Follow these [instructions](https://github.com/US-EPA-CAMD/devops/blob/master/GETTING-STARTED.md) to get the project up and running correctly.

## Installing
1. Open a terminal and navigate to the directory where you wish to store the repository.
2. Clone the repository using one of the following git cli commands or using your favorit Git management software<br>
    **Using SSH**
    ```
    $ git clone git@github.com:US-EPA-CAMD/easey-streaming-services.git
    ```
    **Using HTTPS**
    ```
    $ git clone https://github.com/US-EPA-CAMD/easey-streaming-services.git
    ```
3. Navigate to the projects root directory
    ```
    $ cd easey-streaming-services
    ```
4. Install package dependencies
    ```
    $ yarn install
    ```

## Configuration
The Streaming Services uses a number of environment variables to properly configure the api. The following is the list of configureble values and their default setting.

| Typescript Var Name | Environment Var Name | Default Value | Comment |
| :------------------ | :------------------- | :------------ | :------ |
| name | N/A | streaming-services | Fixed value |
| host | EASEY_STREAMING_SERVICES_HOST | localhost | Configurable
| port | EASEY_STREAMING_SERVICES_PORT | 8080 | Configurable |
| path | EASEY_STREAMING_SERVICES_PATH | streaming-services | Configurable |
| title | EASEY_STREAMING_SERVICES_TITLE | Streaming Services | Configurable |
| description | EASEY_STREAMING_SERVICES_DESCRIPTION | Streaming services API contains endpoints to stream account, allowance, facilities, and emissions data | Configurable |
| env | EASEY_STREAMING_SERVICES_ENV | local-dev | Configurable |
| enableApiKey | EASEY_STREAMING_SERVICES_ENABLE_API_KEY | false | Configurable |
| secretToken | EASEY_STREAMING_SERVICES_SECRET_TOKEN | *** | Dynamically set by CI/CD workflow |
| enableSecretToken | EASEY_STREAMING_SERVICES_ENABLE_SECRET_TOKEN | false | Configurable |
| enableCors | EASEY_STREAMING_SERVICES_ENABLE_CORS | true | Configurable |
| enableGlobalValidationPipes | EASEY_STREAMING_SERVICES_ENABLE_GLOBAL_VALIDATION_PIPE | true | Configurable |
| version | EASEY_STREAMING_SERVICES_VERSION | v0.0.0 | Dynamically set by CI/CD workflow |
| published | EASEY_STREAMING_SERVICES_PUBLISHED | local | Dynamically set by CI/CD workflow |
| streamBatchSize | EASEY_STREAMING_SERVICES_STREAM_BATCH_SIZE | 20000 | Configurable |
| maxPoolSize | EASEY_STREAMING_SERVICES_MAX_POOL_SIZE | 200 | Configurable |
| idleTimeout | EASEY_STREAMING_SERVICES_IDLE_TIMEOUT | 10000 | Configurable |
| connectionTimeout | EASEY_STREAMING_SERVICES_CONNECTION_TIMEOUT | 10000 | Configurable |
| transactionDateLimitYears | EASEY_STREAMING_SERVICES_TRANSACTION_DATE_LIMIT_YEARS | 2 | Configurable |
| enableDebug | EASEY_STREAMING_SERVICES_ENABLE_DEBUG | false | Configurable |
| apiHost | EASEY_API_GATEWAY_HOST | api.epa.gov/easey/dev | Configurable |

## Environment Variables File
Database credentials are injected into the cloud.gov environments as part of the CI/CD deployment process therefore they do not need to be configured. However, when running locally for local development the following environment variables are required to be configured using a local .env file in the root of the project. **PLEASE DO NOT commit the .env file to source control.**

- EASEY_STREAMING SERVICES_ENABLE_DEBUG=true|false
- EASEY_STREAMING SERVICES_ENABLE_API_KEY=true|false
  - IF ABOVE IS TRUE THEN SET
    - EASEY_STREAMING SERVICES_API_KEY={ask project dev/tech lead}
- EASEY_STREAMING SERVICES_ENABLE_SECRET_TOKEN=true|false
  - IF ABOVE IS TRUE THEN SET
    - EASEY_STREAMING SERVICES_SECRET_TOKEN={ask project dev/tech lead}

**Please refer to our [Getting Started](https://github.com/US-EPA-CAMD/devops/blob/master/GETTING-STARTED.md) instructions on how to configure the following environment variables & connect to the database.**
- EASEY_DB_HOST
- EASEY_DB_PORT
- EASEY_DB_NAME
- EASEY_DB_USER
- EASEY_DB_PWD

## Building, Testing, & Running the application
From within the projects root directory run the following commands using the yarn command line interface

**Run in development mode**
```
$ yarn start:dev
```

**Install/update package dependencies & run in development mode**
```
$ yarn up
```

**Unit tests**
```
$ yarn test
```

**Build**
```
$ yarn build
```

**Run in production mode**
```
$ yarn start
```

## API Endpoints
Please refer to the Stremaing Services Swagger Documentation for descriptions of the endpoints.<br>
[Dev Environment](https://api.epa.gov/easey/dev/streaming-services/swagger/) | [Test Environment](https://api.epa.gov/easey/test/streaming-services/swagger/) | [Performance Environment](https://api.epa.gov/easey/perf/streaming-services/swagger/) | [Beta Environment](https://api.epa.gov/easey/beta/streaming-services/swagger/) | [Staging Environment](https://api.epa.gov/easey/staging/streaming-services/swagger/)

## License & Contributing
This project is licensed under the MIT License. We encourage you to read this project’s [License](LICENSE), [Contributing Guidelines](CONTRIBUTING.md), and [Code of Conduct](CODE-OF-CONDUCT.md).

## Disclaimer
The United States Environmental Protection Agency (EPA) GitHub project code is provided on an "as is" basis and the user assumes responsibility for its use. EPA has relinquished control of the information and no longer has responsibility to protect the integrity , confidentiality, or availability of the information. Any reference to specific commercial products, processes, or services by service mark, trademark, manufacturer, or otherwise, does not constitute or imply their endorsement, recommendation or favoring by EPA. The EPA seal and logo shall not be used in any manner to imply endorsement of any commercial product or activity by EPA or the United States Government.
