import { Currency, SecurityType } from 'questrade-api-enumerations';

import { ISymbol } from '../../../../typescript';

export const stockSymbol: ISymbol = {
  averageVol20Days: 30_094_274,
  averageVol3Months: 27_641_633,
  currency: Currency.USD,
  description: 'APPLE INC',
  dividend: 0.77,
  dividendDate: '2019-08-15T00:00:00.000000-04:00',
  eps: 11.78,
  exDate: '2019-08-09T00:00:00.000000-04:00',
  hasOptions: true,
  highPrice52: 232.35,
  industryGroup: 'ComputerHardware',
  industrySector: 'Technology',
  industrySubgroup: 'ConsumerElectronics',
  isQuotable: true,
  isTradable: true,
  listingExchange: 'NASDAQ',
  lowPrice52: 142,
  marketCap: 997_925_327_600,
  minTicks: [
    { minTick: 0.0001, pivot: 0 },
    { minTick: 0.01, pivot: 1 },
  ],
  optionContractDeliverables: { cashInLieu: 0, underlyings: [] },
  optionDurationType: null,
  optionExerciseType: null,
  optionExpiryDate: null,
  optionRoot: '',
  optionStrikePrice: null,
  optionType: null,
  outstandingShares: 4_519_180_000,
  pe: 18.745_33,
  prevDayClosePrice: 227.01,
  securityType: SecurityType.STOCK,
  symbol: 'AAPL',
  symbolId: 8049,
  tradeUnit: 1,
  yield: 1.3948,
};
