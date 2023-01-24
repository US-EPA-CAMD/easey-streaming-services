import { applyDecorators } from '@nestjs/common';
import { IsDefined, IsNotEmpty } from 'class-validator';
import { ErrorMessages } from '@us-epa-camd/easey-common/constants';
import {
  IsInDateRange,
  IsValidDate,
  IsIsoFormat,
  IsDateGreaterThanEqualTo,
  IsYearFormat,
} from '@us-epa-camd/easey-common/pipes';

export function TransactionBeginDate() {
  return applyDecorators(
    IsInDateRange(
      new Date('1993-03-23'),
      false,
      false,
      false,
      {
        message: ErrorMessages.DateRange(
          'transactionBeginDate',
          false,
          `a date between 03/23/1993 and the current date`,
        ),
      },
    ),
    IsValidDate({
      message: ErrorMessages.DateValidity(),
    }),
    IsIsoFormat({
      message: ErrorMessages.SingleFormat(
        'transactionBeginDate',
        'YYYY-MM-DD format',
      ),
    }),
    IsNotEmpty({ message: ErrorMessages.RequiredProperty() }),
  );
}

export function TransactionEndDate() {
  return applyDecorators(
    IsDateGreaterThanEqualTo('transactionBeginDate', {
      message: ErrorMessages.BeginEndDate('transactionBeginDate'),
    }),
    IsInDateRange(
      new Date('1993-03-23'),
      false,
      false,
      false,
      {
        message: ErrorMessages.DateRange(
          'transactionEndDate',
          false,
          `a date between 03/23/1993 and the current date`,
        ),
      },
    ),
    IsValidDate({
      message: ErrorMessages.DateValidity(),
    }),
    IsIsoFormat({
      message: ErrorMessages.SingleFormat(
        'transactionEndDate',
        'YYYY-MM-DD format',
      ),
    }),
    IsNotEmpty({ message: ErrorMessages.RequiredProperty() }),
  );
}

export function BeginDate(isMats = false) {
  let date;
  if (isMats) {
    date = '2015-01-01';
  } else {
    date = '1995-01-01';
  }
  return applyDecorators(
    IsInDateRange(new Date(date), false, true, false, {
      message: ErrorMessages.DateRange(
        'beginDate',
        false,
        `a date between 01/01/${date.substring(
          0,
          4,
        )} and the quarter ending on ${ErrorMessages.ReportingQuarter()}`,
      ),
    }),
    IsValidDate({
      message: ErrorMessages.DateValidity(),
    }),
    IsIsoFormat({
      message: ErrorMessages.SingleFormat('beginDate', 'YYYY-MM-DD format'),
    }),
    IsDefined({
      message: ErrorMessages.RequiredProperty(),
    }),
  );
}

export function EndDate(isMats = false) {
  let date;
  if (isMats) {
    date = '2015-01-01';
  } else {
    date = '1995-01-01';
  }
  return applyDecorators(
    IsDateGreaterThanEqualTo('beginDate', {
      message: ErrorMessages.BeginEndDate('beginDate'),
    }),
    IsInDateRange(new Date(date), false, true, false, {
      message: ErrorMessages.DateRange(
        'endDate',
        false,
        `a date between 01/01/${date.substring(
          0,
          4,
        )} and the quarter ending on ${ErrorMessages.ReportingQuarter()}`,
      ),
    }),
    IsValidDate({
      message: ErrorMessages.DateValidity(),
    }),
    IsIsoFormat({
      message: ErrorMessages.SingleFormat('endDate', 'YYYY-MM-DD format'),
    }),
    IsDefined({ message: ErrorMessages.RequiredProperty() }),
  );
}

export function OpYear() {
  return applyDecorators(
    IsInDateRange(new Date(1995, 0), true, true, false, {
      each: true,
      message: ErrorMessages.DateRange(
        'year',
        true,
        `a year between 1995 and the quarter ending on ${ErrorMessages.ReportingQuarter()}`,
      ),
    }),
    IsYearFormat({
      each: true,
      message: ErrorMessages.MultipleFormat('year', 'YYYY format'),
    }),
    IsDefined({ message: ErrorMessages.RequiredProperty() }),
  );
}
