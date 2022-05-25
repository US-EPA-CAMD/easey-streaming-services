import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { getManager, ILike } from 'typeorm';

import { TransactionTypeCode } from '../entities/transaction-type-code.entity';

export function IsTransactionType(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isTransactionType',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        async validate(value: any, args: ValidationArguments) {
          const manager = getManager();

          const found = await manager.findOne(TransactionTypeCode, {
            transactionTypeDescription: ILike(value),
          });

          return found != null;
        },
      },
    });
  };
}
