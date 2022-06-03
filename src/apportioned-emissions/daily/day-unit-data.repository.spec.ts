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
import { DayUnitDataRepository } from './day-unit-data.repository';
import { EmissionsQueryBuilder } from '../../utils/emissions-query-builder';
import { StreamDailyApportionedEmissionsParamsDTO } from '../../dto/daily-apportioned-emissions.params.dto';

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

let streamFilters = new StreamDailyApportionedEmissionsParamsDTO();
streamFilters.beginDate = new Date();
streamFilters.endDate = new Date();
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

describe('DayUnitDataRepository', () => {
  let repository: DayUnitDataRepository;
  let queryBuilder: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DayUnitDataRepository,
        {
          provide: SelectQueryBuilder,
          useFactory: mockQueryBuilder,
        },
      ],
    }).compile();

    repository = module.get(DayUnitDataRepository);
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
    it('calls streamEmissions and streams DayUnitData from the repository', () => {
      const result = repository.buildQuery(
        fieldMappings.emissions.daily.data.aggregation.unit,
        streamFilters,
      );

      expect(queryBuilder.getQueryAndParameters).toHaveBeenCalled();
    });
  });

  describe('streamEmissionsFacilityAggregation', () => {
    it('calls buildFacilityAggregationQuery from the repository', () => {
      const result = repository.buildFacilityAggregationQuery(streamFilters);

      expect(queryBuilder.getQueryAndParameters).toHaveBeenCalled();
    });
  });

  describe('streamEmissionsStateAggregation', () => {
    it('calls buildStateAggregationQuery from the repository', () => {
      const result = repository.buildStateAggregationQuery(streamFilters);

      expect(queryBuilder.getQueryAndParameters).toHaveBeenCalled();
    });
  });

  describe('streamEmissionsNationalAggregation', () => {
    it('calls buildNationalAggregationQuery from the repository', () => {
      const result = repository.buildNationalAggregationQuery(streamFilters);

      expect(queryBuilder.getQueryAndParameters).toHaveBeenCalled();
    });
  });
});
