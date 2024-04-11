import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { EntityManager, ILike } from 'typeorm';

import { SourceCategoryCode } from '../entities/source-category-code.entity';

@Injectable()
@ValidatorConstraint({ name: 'isSourceCategory', async: true })
export class IsSourceCategoryValidator implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}

  async validate(value: any, _args: ValidationArguments) {
    const found = await this.entityManager.findOneBy(SourceCategoryCode, {
      sourceCategoryDescription: ILike(value),
    });
    return found != null;
  }
}
