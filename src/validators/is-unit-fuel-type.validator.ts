import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { EntityManager, ILike } from 'typeorm';

import { FuelTypeCode } from '../entities/fuel-type-code.entity';

@Injectable()
@ValidatorConstraint({ name: 'isUnitFuelType', async: true })
export class IsUnitFuelTypeValidator implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}

  async validate(value: any, _args: ValidationArguments) {
    const found = await this.entityManager.findOneBy(FuelTypeCode, {
      fuelTypeDescription: ILike(value),
    });
    return found != null;
  }
}
