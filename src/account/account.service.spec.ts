import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { AccountFactRepository } from './account-fact.repository';
import { AccountService } from './account.service';
import { StreamAccountAttributesParamsDTO } from '../dto/account-attributes.params.dto';
import { StreamableFile } from '@nestjs/common';
import { StreamingService } from '../streaming/streaming.service';

const mockAccountFactRepository = () => ({
  buildQuery: jest.fn(),
});

const mockStreamingService = () => ({
  getStream: jest
    .fn()
    .mockResolvedValue(new StreamableFile(Buffer.from('stream'))),
});

jest.mock('uuid', () => {
  return { v4: jest.fn().mockReturnValue(0) };
});

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
    headers: {
      accept: 'text/csv',
    },
    on: jest.fn(),
  };
};

describe('-- Account Service --', () => {
  let accountService: AccountService;
  let streamingService: StreamingService;
  let accountFactRepository: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        AccountService,
        {
          provide: AccountFactRepository,
          useFactory: mockAccountFactRepository,
        },
        {
          provide: StreamingService,
          useFactory: mockStreamingService,
        },
      ],
    }).compile();

    accountService = module.get(AccountService);
    accountFactRepository = module.get(AccountFactRepository);
    streamingService = module.get(StreamingService);
    req = mockRequest();
    req.res.setHeader.mockReturnValue();
  });

  describe('streamAccountAttributes', () => {
    it('streams all account attributes', async () => {
      accountFactRepository.buildQuery.mockReturnValue(['', []]);

      let filters = new StreamAccountAttributesParamsDTO();

      req.headers.accept = '';

      let result = await accountService.streamAllAccountAttributes(
        req,
        filters,
      );

      expect(result).toEqual(new StreamableFile(Buffer.from('stream')));
    });
  });
});
