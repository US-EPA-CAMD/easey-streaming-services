import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';

import {
  State,
  UnitType,
  UnitFuelType,
  ControlTechnology,
  Program,
  ExcludeApportionedEmissions,
} from '@us-epa-camd/easey-common/enums';

import { fieldMappings } from '../../constants/emissions-field-mappings';
import { EmissionsQueryBuilder } from '../../utils/emissions-query-builder';
import { MonthUnitDataRepository } from './month-unit-data.repository';
import { StreamMonthlyApportionedEmissionsParamsDTO } from '../../dto/monthly-apportioned-emissions.params.dto';

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
  getMany: jest.fn(),
  getManyAndCount: jest.fn(),
  select: jest.fn(),
  addSelect: jest.fn(),
  innerJoin: jest.fn(),
  orderBy: jest.fn(),
  addOrderBy: jest.fn(),
  addGroupBy: jest.fn(),
  getCount: jest.fn(),
  skip: jest.fn(),
  take: jest.fn(),
  stream: jest.fn(),
  getQueryAndParameters: jest.fn().mockResolvedValue('mockEmissions'),
});

let streamFilters = new StreamMonthlyApportionedEmissionsParamsDTO();
streamFilters.year = [2019];
streamFilters.month = [1, 2];
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

describe('MonthUnitDataRepository', () => {
  let repository: MonthUnitDataRepository;
  let queryBuilder: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MonthUnitDataRepository,
        {
          provide: SelectQueryBuilder,
          useFactory: mockQueryBuilder,
        },
      ],
    }).compile();

    repository = module.get(MonthUnitDataRepository);
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
    queryBuilder.getCount.mockReturnValue('mockCount');
    queryBuilder.getMany.mockReturnValue('mockEmissions');
    queryBuilder.getManyAndCount.mockReturnValue(['mockEmissions', 0]);
    queryBuilder.stream.mockReturnValue('mockEmissions');

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
  });

  describe('streamEmissions', () => {
    it('calls buildQuery and streams MonthUnitData from the repository', async () => {
      const result = await repository.buildQuery(
        fieldMappings.emissions.monthly.data.aggregation.unit,
        streamFilters
      );

      expect(queryBuilder.getQueryAndParameters).toHaveBeenCalled();
      expect(result).toEqual('mockEmissions');
    });
  });

  describe('streamEmissionsFacilityAggregation', () => {
    it('calls buildFacilityAggregationQuery from the repository', async () => {
      const result = repository.buildFacilityAggregationQuery(streamFilters);

      expect(queryBuilder.getQueryAndParameters).toHaveBeenCalled();
    });
  });

  describe('streamEmissionsStateAggregation', () => {
    it('calls buildStateAggregationQuery from the repository', async () => {
      const result = repository.buildStateAggregationQuery(streamFilters);

      expect(queryBuilder.getQueryAndParameters).toHaveBeenCalled();
    });
  });

  describe('streamEmissionsNationalAggregation', () => {
    it('calls buildNationalAggregationQuery from the repository', async () => {
      const result = repository.buildNationalAggregationQuery(streamFilters);

      expect(queryBuilder.getQueryAndParameters).toHaveBeenCalled();
    });
  });

});
