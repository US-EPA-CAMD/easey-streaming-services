import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { ProgramCode } from '../entities/program-code.entity';

@Injectable()
@ValidatorConstraint({ name: 'isProgram', async: true })
export class IsProgramValidator implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}

  async validate(value: any, args: ValidationArguments) {
    let found = null;
    const { dataType } = args.constraints[0];

    switch (dataType) {
      case 'Facilities':
        found = await this.entityManager.findOneBy(ProgramCode, {
          programCode: value.toUpperCase(),
        });
        break;
      case 'Emissions':
        found = await this.entityManager.findOneBy(ProgramCode, {
          programCode: value.toUpperCase(),
          emissionsUIFilter: 1,
        });
        break;
    }

    return found != null;
  }
}
