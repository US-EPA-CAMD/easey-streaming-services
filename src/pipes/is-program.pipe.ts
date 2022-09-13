import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { getManager } from 'typeorm';

import { ProgramCode } from '../entities/program-code.entity';

/**
 * This decorator can optionally exclude programs specified in the @property param
 */
export function IsProgram(dataType: string, validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isProgram',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        async validate(value: any, args: ValidationArguments) {
          let found = null;
          const manager = getManager();

          switch(dataType) {
            case 'Facilities':
              found = await manager.findOne(ProgramCode, {
                programCode: value.toUpperCase()
              });
              break;
            case 'Emissions':
              found = await manager.findOne(ProgramCode, {
                programCode: value.toUpperCase(),
                emissionsUIFilter: 1,
              });
              break;
          }

          return found != null;
        },
      },
    });
  };
}
