import { registerDecorator, ValidationOptions } from 'class-validator';

import { IsUnitTypeValidator } from '../validators/is-unit-type.validator';

export function IsUnitType(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsUnitType',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsUnitTypeValidator,
    });
  };
}
