import { registerDecorator, ValidationOptions } from 'class-validator';

import { IsUnitFuelTypeValidator } from '../validators/is-unit-fuel-type.validator';

export function IsUnitFuelType(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isUnitFuelType',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsUnitFuelTypeValidator,
    });
  };
}
