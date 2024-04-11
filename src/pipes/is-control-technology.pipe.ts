import { registerDecorator, ValidationOptions } from 'class-validator';

import { IsControlTechnologyValidator } from '../validators/is-control-technology.validator';

export function IsControlTechnology(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isControlTechnology',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsControlTechnologyValidator,
    });
  };
}
