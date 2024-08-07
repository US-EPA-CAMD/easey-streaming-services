import { Injectable, StreamableFile } from '@nestjs/common';
import { ExcludeFacilityAttributes } from '@us-epa-camd/easey-common/enums';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { exclude } from '@us-epa-camd/easey-common/utilities';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { Transform } from 'stream';
import { v4 as uuid } from 'uuid';

import { fieldMappings } from '../constants/facility-attributes-field-mappings';
import { StreamFacilityAttributesParamsDTO } from '../dto/facility-attributes-params.dto';
import { FacilityAttributesDTO } from '../dto/facility-attributes.dto';
import { StreamingService } from '../streaming/streaming.service';
import { FacilityUnitAttributesRepository } from './facility-unit-attributes.repository';

@Injectable()
export class FacilitiesService {
  constructor(
    private readonly logger: Logger,
    private readonly streamingService: StreamingService,
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
          const splitOwnWithPipe = data.ownerOperator?.split('|');
          const splitOprWithPipe = data.oprDisplay?.split('|');

          const uniqueOwn = [...new Set(splitOwnWithPipe)].join('|');
          const uniqueOpr = [...new Set(splitOprWithPipe)].join('|');

          const uniqueOwnOprList = [uniqueOwn, uniqueOpr];
          const ownerOperator = uniqueOwnOprList.filter(e => e).join('|');

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
            ownerOperator.length > 0 ? `${ownerOperator}` : null;
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

    const [sql, values] = await this.repository.buildQuery(params);

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
