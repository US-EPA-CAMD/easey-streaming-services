import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

import {
  State,
  UnitType,
  UnitFuelType,
  ControlTechnology,
  Program,
  ExcludeApportionedEmissions,
} from '@us-epa-camd/easey-common/enums';

import { fieldMappings } from '../../constants/emissions-field-mappings';
import { AnnualUnitDataRepository } from './annual-unit-data.repository';
import { EmissionsQueryBuilder } from '../../utils/emissions-query-builder';
import { StreamAnnualApportionedEmissionsParamsDTO } from '../../dto/annual-apportioned-emissions.params.dto';

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

let streamFilters = new StreamAnnualApportionedEmissionsParamsDTO();
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

describe('AnnualUnitDataRepository', () => {
  let repository: AnnualUnitDataRepository;
  let queryBuilder: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AnnualUnitDataRepository,
        EntityManager,
        {
          provide: SelectQueryBuilder,
          useFactory: mockQueryBuilder,
        },
      ],
    }).compile();

    repository = module.get(AnnualUnitDataRepository);
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
    it('builds annual emissions query', async () => {
      const result = await repository.buildQuery(
        fieldMappings.emissions.annual.data.aggregation.unit,
        streamFilters,
      );

      expect(queryBuilder.getQueryAndParameters).toHaveBeenCalled();
      expect(result).toEqual('mockEmissions');
    });
  });

  describe('buildEmissionsFacilityAggregation', () => {
    it('builds annual emissions aggregated by facility query', () => {
      const result = repository.buildFacilityAggregationQuery(streamFilters);

      expect(result).toEqual('mockEmissions');
      expect(queryBuilder.getQueryAndParameters).toHaveBeenCalled();
    });
  });

  describe('buildEmissionsStateAggregation', () => {
    it('builds annual emissions aggregated by state query', () => {
      const result = repository.buildStateAggregationQuery(streamFilters);

      expect(result).toEqual('mockEmissions');
      expect(queryBuilder.getQueryAndParameters).toHaveBeenCalled();
    });
  });

  describe('buildNationalAggregationQuery', () => {
    it('builds annual emissions nationally aggregated query', () => {
      const result = repository.buildNationalAggregationQuery(streamFilters);

      expect(result).toEqual('mockEmissions');
      expect(queryBuilder.getQueryAndParameters).toHaveBeenCalled();
    });
  });
});
