import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { EntityManager, ILike } from 'typeorm';

import { UnitTypeCode } from '../entities/unit-type-code.entity';

@Injectable()
@ValidatorConstraint({ name: 'isUnitType', async: true })
export class IsUnitTypeValidator implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}

  async validate(value: any, _args: ValidationArguments) {
    const found = await this.entityManager.findOneBy(UnitTypeCode, {
      unitTypeDescription: ILike(value),
    });
    return found != null;
  }
}
