import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { EntityManager, ILike } from 'typeorm';

import { ControlCode } from '../entities/control-code.entity';

@Injectable()
@ValidatorConstraint({ name: 'isControlTechnology', async: true })
export class IsControlTechnologyValidator
  implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}

  async validate(value: any, _args: ValidationArguments) {
    const found = await this.entityManager.findOneBy(ControlCode, {
      controlDescription: ILike(value),
    });
    return found != null;
  }
}
