import { DbLookupValidator } from '@us-epa-camd/easey-common/validators';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { ILike } from 'typeorm';

import { SourceCategoryCode } from '../entities/source-category-code.entity';

export function IsSourceCategory(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isSourceCategory',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [
        {
          type: SourceCategoryCode,
          ignoreEmpty: false,
          findOption: (args: ValidationArguments) => ({
            where: {
              sourceCategoryDescription: ILike(args.value),
            },
          }),
        },
      ],
      validator: DbLookupValidator,
    });
  };
}
