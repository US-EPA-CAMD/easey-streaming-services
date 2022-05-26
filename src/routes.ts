import { Routes } from 'nest-router';

import { AccountModule } from './account/account.module';
import { FacilitiesModule } from "./facilities/facilities.module";
// import { AllowanceHoldingsModule } from './allowance-holdings/allowance-holdings.module';
// import { AllowanceTransactionsModule } from './allowance-transactions/allowance-transactions.module';
import { AllowanceComplianceModule } from './allowance-compliance/allowance-compliance.module';
// import { EmissionsComplianceModule } from './emissions-compliance/emissions-compliance.module';
import { ApportionedEmissionsModule } from './apportioned-emissions/apportioned-emissions.module';
import { HourlyApportionedEmissionsModule } from './apportioned-emissions/hourly/hourly-apportioned-emissions.module';
import { DailyApportionedEmissionsModule } from './apportioned-emissions/daily/daily-apportioned-emissions.module';
import { MonthlyApportionedEmissionsModule } from './apportioned-emissions/monthly/monthly-apportioned-emissions.module';
import { QuarterlyApportionedEmissionsModule } from './apportioned-emissions/quarterly/quarterly-apportioned-emissions.module';
import { AnnualApportionedEmissionsModule } from './apportioned-emissions/annual/annual-apportioned-emissions.module';
import { OzoneApportionedEmissionsModule } from './apportioned-emissions/ozone/ozone-apportioned-emissions.module';

const routes: Routes = [
  {
    path: '/facilities',
    module: FacilitiesModule,
  },
  {
    path: '/accounts',
    module: AccountModule,
  },
  // {
  //   path: '/allowance-holdings',
  //   module: AllowanceHoldingsModule,
  // },
  // {
  //   path: '/allowance-transactions',
  //   module: AllowanceTransactionsModule,
  // },
  {
    path: '/allowance-compliance',
    module: AllowanceComplianceModule,
  },
  // {
  //   path: '/emissions-compliance',
  //   module: EmissionsComplianceModule,
  // },
  {
    path: 'emissions/apportioned',
    module: ApportionedEmissionsModule,
    children: [
      {
        path: '/hourly',
        module: HourlyApportionedEmissionsModule,
      },
      {
        path: '/daily',
        module: DailyApportionedEmissionsModule,
      },
      {
        path: '/monthly',
        module: MonthlyApportionedEmissionsModule,
      },
      {
        path: '/quarterly',
        module: QuarterlyApportionedEmissionsModule,
      },
      {
        path: '/annual',
        module: AnnualApportionedEmissionsModule,
      },
      {
        path: '/ozone',
        module: OzoneApportionedEmissionsModule,
      },
    ],
  }
];

export default routes;
