import { applyDecorators } from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiQuery,
} from '@nestjs/swagger';

export const BadRequestResponse = () =>
  ApiBadRequestResponse({
    description: 'Invalid Request',
  });

export const NotFoundResponse = () =>
  ApiNotFoundResponse({
    description: 'Resource Not Found',
  });

export function ApiQueryFacilityMultiSelect() {
  return applyDecorators(
    ApiQuery({
      style: 'pipeDelimited',
      name: 'year',
      required: true,
      explode: false,
    }),
    ApiQuery({
      style: 'pipeDelimited',
      name: 'stateCode',
      required: false,
      explode: false,
    }),
    ApiQuery({
      style: 'pipeDelimited',
      name: 'facilityId',
      required: false,
      explode: false,
    }),
    ApiQuery({
      style: 'pipeDelimited',
      name: 'unitType',
      required: false,
      explode: false,
    }),
    ApiQuery({
      style: 'pipeDelimited',
      name: 'controlTechnologies',
      required: false,
      explode: false,
    }),
    ApiQuery({
      style: 'pipeDelimited',
      name: 'unitFuelType',
      required: false,
      explode: false,
    }),
    ApiQuery({
      style: 'pipeDelimited',
      name: 'programCodeInfo',
      required: false,
      explode: false,
    }),
    ApiQuery({
      style: 'pipeDelimited',
      name: 'sourceCategory',
      required: false,
      explode: false,
    }),
  );
}

export const ApiQueryAccountMultiSelect = () => {
  return applyDecorators(
    ApiQuery({
      style: 'pipeDelimited',
      name: 'accountType',
      required: false,
      explode: false,
    }),
    ApiQuery({
      style: 'pipeDelimited',
      name: 'accountNumber',
      required: false,
      explode: false,
    }),
    ApiQuery({
      style: 'pipeDelimited',
      name: 'facilityId',
      required: false,
      explode: false,
    }),
    ApiQuery({
      style: 'pipeDelimited',
      name: 'ownerOperator',
      required: false,
      explode: false,
    }),
    ApiQuery({
      style: 'pipeDelimited',
      name: 'stateCode',
      required: false,
      explode: false,
    }),
    ApiQuery({
      style: 'pipeDelimited',
      name: 'programCodeInfo',
      required: false,
      explode: false,
    }),
  );
};

export const ApiQueryComplianceMultiSelect = () => {
  return applyDecorators(
    ApiQuery({
      style: 'pipeDelimited',
      name: 'facilityId',
      required: false,
      explode: false,
    }),
    ApiQuery({
      style: 'pipeDelimited',
      name: 'ownerOperator',
      required: false,
      explode: false,
    }),
    ApiQuery({
      style: 'pipeDelimited',
      name: 'stateCode',
      required: false,
      explode: false,
    }),
    ApiQuery({
      style: 'pipeDelimited',
      name: 'year',
      required: false,
      explode: false,
    }),
  );
};

export function ApiQueryEmissionsMultiSelect() {
  return applyDecorators(
    ApiQuery({
      style: 'pipeDelimited',
      name: 'stateCode',
      required: false,
      explode: false,
    }),
    ApiQuery({
      style: 'pipeDelimited',
      name: 'facilityId',
      required: false,
      explode: false,
    }),
    ApiQuery({
      style: 'pipeDelimited',
      name: 'unitType',
      required: false,
      explode: false,
    }),
    ApiQuery({
      style: 'pipeDelimited',
      name: 'controlTechnologies',
      required: false,
      explode: false,
    }),
    ApiQuery({
      style: 'pipeDelimited',
      name: 'unitFuelType',
      required: false,
      explode: false,
    }),
  );
}

export function ApiQueryQuarterly() {
  return applyDecorators(
    ApiQuery({
      style: 'pipeDelimited',
      name: 'year',
      required: true,
      explode: false,
    }),
    ApiQuery({
      style: 'pipeDelimited',
      name: 'quarter',
      required: true,
      explode: false,
    }),
  );
}

export function ApiQueryAnnually() {
  return applyDecorators(
    ApiQuery({
      style: 'pipeDelimited',
      name: 'year',
      required: true,
      explode: false,
    }),
  );
}

export function ApiQueryMonthly() {
  return applyDecorators(
    ApiQuery({
      style: 'pipeDelimited',
      name: 'month',
      required: true,
      explode: false,
    }),
    ApiQuery({
      style: 'pipeDelimited',
      name: 'year',
      required: true,
      explode: false,
    }),
  );
}

export function ApiProgramQuery() {
  return applyDecorators(
    ApiQuery({
      style: 'pipeDelimited',
      name: 'programCodeInfo',
      required: false,
      explode: false,
    }),
  );
}

export function ExcludeQuery() {
  return applyDecorators(
    ApiQuery({
      style: 'pipeDelimited',
      name: 'exclude',
      required: false,
      explode: false,
    }),
  );
}

export function ApiLocationNameQuery() {
  return applyDecorators(
    ApiQuery({
      style: 'pipeDelimited',
      name: 'locationName',
      required: false,
      explode: false,
    }),
  );
}
