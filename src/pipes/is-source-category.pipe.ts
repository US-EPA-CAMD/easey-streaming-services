import { registerDecorator, ValidationOptions } from 'class-validator';

import { IsSourceCategoryValidator } from '../validators/is-source-category.validator';

export function IsSourceCategory(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsSourceCategory',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsSourceCategoryValidator,
    });
  };
}
