import { Test } from '@nestjs/testing';
import {
  ControlTechnology,
  ExcludeApportionedEmissions,
  Program,
  State,
  UnitFuelType,
  UnitType,
} from '@us-epa-camd/easey-common/enums';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { fieldMappings } from '../../constants/emissions-field-mappings';
import { StreamOzoneApportionedEmissionsParamsDTO } from '../../dto/ozone-apportioned-emissions.params.dto';
import { EmissionsQueryBuilder } from '../../utils/emissions-query-builder';
import { OzoneUnitDataRepository } from './ozone-unit-data.repository';

jest.mock('../../utils/emissions-query-builder');

const mockRequest = (url?: string, page?: number, perPage?: number) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
    query: {
      page,
      perPage,
    },
  };
};

const mockQueryBuilder = () => ({
  andWhere: jest.fn(),
  select: jest.fn(),
  addSelect: jest.fn(),
  innerJoin: jest.fn(),
  orderBy: jest.fn(),
  addOrderBy: jest.fn(),
  addGroupBy: jest.fn(),
  skip: jest.fn(),
  take: jest.fn(),
  getQueryAndParameters: jest.fn(),
});

let streamFilters = new StreamOzoneApportionedEmissionsParamsDTO();
streamFilters.year = [2019];
streamFilters.stateCode = [State.TX];
streamFilters.facilityId = [3];
streamFilters.unitType = [
  UnitType.BUBBLING_FLUIDIZED,
  UnitType.ARCH_FIRE_BOILER,
];
streamFilters.unitFuelType = [UnitFuelType.COAL, UnitFuelType.DIESEL_OIL];
streamFilters.controlTechnologies = [
  ControlTechnology.ADDITIVES_TO_ENHANCE,
  ControlTechnology.OTHER,
];
streamFilters.programCodeInfo = [Program.ARP, Program.RGGI];
streamFilters.exclude = [
  ExcludeApportionedEmissions.CO2_RATE,
  ExcludeApportionedEmissions.COUNT_OP_TIME,
];

describe('OzoneUnitDataRepository', () => {
  let repository: OzoneUnitDataRepository;
  let queryBuilder: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EntityManager,
        OzoneUnitDataRepository,
        {
          provide: SelectQueryBuilder,
          useFactory: mockQueryBuilder,
        },
      ],
    }).compile();

    repository = module.get(OzoneUnitDataRepository);
    queryBuilder = module.get(SelectQueryBuilder);
    req = mockRequest('');
    req.res.setHeader.mockReturnValue();

    EmissionsQueryBuilder.createEmissionsQuery = jest
      .fn()
      .mockReturnValue(queryBuilder);

    queryBuilder.select.mockReturnValue(queryBuilder);
    queryBuilder.addSelect.mockReturnValue(queryBuilder);
    queryBuilder.innerJoin.mockReturnValue(queryBuilder);
    queryBuilder.andWhere.mockReturnValue(queryBuilder);
    queryBuilder.orderBy.mockReturnValue(queryBuilder);
    queryBuilder.addOrderBy.mockReturnValue(queryBuilder);
    queryBuilder.addGroupBy.mockReturnValue(queryBuilder);
    queryBuilder.skip.mockReturnValue(queryBuilder);
    queryBuilder.take.mockReturnValue('mockPagination');
    queryBuilder.getQueryAndParameters.mockReturnValue('mockEmissions');

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
  });

  describe('buildQuery', () => {
    it('builds ozone emissions query', async () => {
      const result = await repository.buildQuery(
        fieldMappings.emissions.ozone.data.aggregation.unit,
        streamFilters,
      );

      expect(queryBuilder.getQueryAndParameters).toHaveBeenCalled();
      expect(result).toEqual('mockEmissions');
    });
  });

  describe('buildEmissionsFacilityAggregation', () => {
    it('builds ozone emissions aggregated by facility query', async () => {
      const result = await repository.buildFacilityAggregationQuery(
        streamFilters,
      );

      expect(result).toEqual('mockEmissions');
      expect(queryBuilder.getQueryAndParameters).toHaveBeenCalled();
    });
  });

  describe('buildEmissionsStateAggregation', () => {
    it('builds ozone emissions aggregated by state query', async () => {
      const result = await repository.buildStateAggregationQuery(streamFilters);

      expect(result).toEqual('mockEmissions');
      expect(queryBuilder.getQueryAndParameters).toHaveBeenCalled();
    });
  });

  describe('buildEmissionsNationalAggregation', () => {
    it('builds ozone emissions aggregated by National query', async () => {
      const result = await repository.buildNationalAggregationQuery(
        streamFilters,
      );

      expect(result).toEqual('mockEmissions');
      expect(queryBuilder.getQueryAndParameters).toHaveBeenCalled();
    });
  });
});
