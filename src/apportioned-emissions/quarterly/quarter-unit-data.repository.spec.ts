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
import { StreamQuarterlyApportionedEmissionsParamsDTO } from '../../dto/quarterly-apportioned-emissions.params.dto';
import { EmissionsQueryBuilder } from '../../utils/emissions-query-builder';
import { QuarterUnitDataRepository } from './quarter-unit-data.repository';

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
  stream: jest.fn(),
  getQueryAndParameters: jest.fn(),
});

let streamFilters = new StreamQuarterlyApportionedEmissionsParamsDTO();
streamFilters.year = [2019];
streamFilters.quarter = [1, 3];
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

describe('QuarterUnitDataRepository', () => {
  let repository: QuarterUnitDataRepository;
  let queryBuilder: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EntityManager,
        QuarterUnitDataRepository,
        {
          provide: SelectQueryBuilder,
          useFactory: mockQueryBuilder,
        },
      ],
    }).compile();

    repository = module.get(QuarterUnitDataRepository);
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
    queryBuilder.addGroupBy.mockReturnValue(queryBuilder);
    queryBuilder.addOrderBy.mockReturnValue(queryBuilder);
    queryBuilder.skip.mockReturnValue(queryBuilder);
    queryBuilder.take.mockReturnValue('mockPagination');
    queryBuilder.getQueryAndParameters.mockReturnValue('mockEmissions');

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
  });

  describe('buildQuery', () => {
    it('builds quarterly emissions query', async () => {
      const result = await repository.buildQuery(
        fieldMappings.emissions.quarterly.data.aggregation.unit,
        streamFilters,
      );

      expect(queryBuilder.getQueryAndParameters).toHaveBeenCalled();
      expect(result).toEqual('mockEmissions');
    });
  });

  describe('buildEmissionsFacilityAggregation', () => {
    it('builds quarterly emissions aggregated by facility query', () => {
      const result = repository.buildFacilityAggregationQuery(streamFilters);

      expect(result).toEqual('mockEmissions');
      expect(queryBuilder.getQueryAndParameters).toHaveBeenCalled();
    });
  });

  describe('buildEmissionsStateAggregation', () => {
    it('builds quarterly emissions aggregated by state query', () => {
      const result = repository.buildStateAggregationQuery(streamFilters);

      expect(result).toEqual('mockEmissions');
      expect(queryBuilder.getQueryAndParameters).toHaveBeenCalled();
    });
  });

  describe('buildEmissionsNationalAggregation', () => {
    it('builds quarterly emissions aggregated nationally query', () => {
      const result = repository.buildNationalAggregationQuery(streamFilters);

      expect(result).toEqual('mockEmissions');
      expect(queryBuilder.getQueryAndParameters).toHaveBeenCalled();
    });
  });
});
