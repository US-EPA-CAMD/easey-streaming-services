import { Request } from 'express';
import { v4 as uuid } from 'uuid';
import { Transform } from 'stream';
import { plainToClass } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';

import {
  Injectable,
  StreamableFile,
} from '@nestjs/common';

import { Logger } from '@us-epa-camd/easey-common/logger';
import { exclude } from '@us-epa-camd/easey-common/utilities';
import { ExcludeFacilityAttributes } from '@us-epa-camd/easey-common/enums';

import { fieldMappings } from '../constants/facility-attributes-field-mappings';
import { StreamingService } from '../streaming/streaming.service';
import { FacilityUnitAttributesRepository } from './facility-unit-attributes.repository';
import { FacilityAttributesDTO } from '../dto/facility-attributes.dto';
import { StreamFacilityAttributesParamsDTO } from '../dto/facility-attributes-params.dto';

@Injectable()
export class FacilitiesService {

  constructor(
    private readonly logger: Logger,
    private readonly streamingService: StreamingService,
    @InjectRepository(FacilityUnitAttributesRepository)
    private readonly repository: FacilityUnitAttributesRepository,
  ) {}

  async streamAttributes(
    req: Request,
    params: StreamFacilityAttributesParamsDTO,
  ): Promise<StreamableFile> {
    const disposition = `attachment; filename="facility-attributes-${uuid()}`;

    const fieldMappingsList = params.exclude
      ? fieldMappings.facilities.attributes.filter(
          item => !params.exclude.includes(item.value),
        )
      : fieldMappings.facilities.attributes;

    const json2Dto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        delete data.id;
        data = exclude(data, params, ExcludeFacilityAttributes);

        if (data.commercialOperationDate) {
          const commercialOperationDate = new Date(
            data.commercialOperationDate,
          );
          data.commercialOperationDate = commercialOperationDate
            .toISOString()
            .split('T')[0];
        }

        if (data.associatedGeneratorsAndNameplateCapacity) {
          let associatedGeneratorsAndNameplateCapacityStr = '';
          const array = [data.ownerOperator, data.oprDisplay];
          const ownOprList = array
            .filter(e => e)
            .join(',')
            .slice(0, -1)
            .split('),');
          const ownOprUniqueList = [...new Set(ownOprList)];
          const ownerOperator = ownOprUniqueList.join('),');

          const generatorIdArr = data.associatedGeneratorsAndNameplateCapacity?.split(
            ', ',
          );
          const arpNameplateCapacityArr = data.arpNameplateCapacity?.split(
            ', ',
          );
          const otherNameplateCapacityArr = data.otherNameplateCapacity?.split(
            ', ',
          );

          for (let index = 0; index < generatorIdArr.length; index++) {
            associatedGeneratorsAndNameplateCapacityStr +=
              generatorIdArr[index];
            if (
              arpNameplateCapacityArr &&
              arpNameplateCapacityArr[index] !== 'null'
            ) {
              associatedGeneratorsAndNameplateCapacityStr += ` (${Number(
                arpNameplateCapacityArr[index],
              )})`;
            } else if (
              otherNameplateCapacityArr &&
              otherNameplateCapacityArr[index] !== 'null'
            ) {
              associatedGeneratorsAndNameplateCapacityStr += ` (${Number(
                otherNameplateCapacityArr[index],
              )})`;
            }
            if (
              generatorIdArr.length > 1 &&
              index < generatorIdArr.length - 1
            ) {
              associatedGeneratorsAndNameplateCapacityStr += ', ';
            }
          }

          data.ownerOperator =
            ownerOperator.length > 0 ? `${ownerOperator})` : null;
          data.associatedGeneratorsAndNameplateCapacity = associatedGeneratorsAndNameplateCapacityStr;
        }

        delete data.oprDisplay;
        delete data.arpNameplateCapacity;
        delete data.otherNameplateCapacity;

        const dto = plainToClass(FacilityAttributesDTO, data, {
          enableImplicitConversion: true,
        });

        callback(null, dto);
      },
    });

    const [sql, values] = await this.repository.buildQuery(fieldMappingsList, params);

    return this.streamingService.getStream(
      req,
      sql,
      values,
      json2Dto,
      disposition,
      fieldMappingsList,
    );
  }
}

export default FacilitiesService;