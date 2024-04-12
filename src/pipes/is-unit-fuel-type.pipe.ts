import { DbLookupValidator } from '@us-epa-camd/easey-common/validators';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { ILike } from 'typeorm';

import { FuelTypeCode } from '../entities/fuel-type-code.entity';

export function IsUnitFuelType(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isUnitFuelType',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [
        {
          type: FuelTypeCode,
          ignoreEmpty: false,
          findOption: (args: ValidationArguments) => ({
            where: {
              fuelTypeDescription: ILike(args.value),
            },
          }),
        },
      ],
      validator: DbLookupValidator,
    });
  };
}
