import {
  Credentials,
  IQuestradeApi,
  OptionsFilters,
  StrategyVariantRequest,
} from '../../typescript';
import { void0 } from '../../utils';
import {
  _getAccounts,
  _getActivities,
  _getBalances,
  _getExecutions,
  _getOrders,
  _getOrdersByIds,
  _getPositions,
  _getServerTime,
  _myBalances,
} from './AccountsCalls';
import {
  _getCandles,
  _getMarkets,
  _getMarketsQuotesStrategies,
  _getOptionsById,
  _getQuotesByIds,
  // _getQuotesOptionsbyFilterAndIds,
  _getQuotesOptionsByIds,
  _getQuotesOptionsFilter,
  _getSymbolsByIds,
  // _getSymbolSearchAndCount,
  _getSymbolSearch,
  _getSymbolSearchAll,
  _getSymbolSearchCount,
} from './MarketsCalls';

export const _getQuestradeApi = async (
  credentials: Credentials
): Promise<IQuestradeApi> => {
  const [
    accounts,
    activities,
    balances,
    candles,
    executions,
    markets,
    marketsQuotesStrategies,
    optionsById,
    orders,
    ordersByIds,
    positions,
    quotesByIds,
    // quotesOptionsbyFilterAndIds,
    quotesOptionsByIds,
    quotesOptionsFilter,
    serverTime,
    symbolsByIds,
    symbolSearchAll,
    // symbolSearchAndCount,
    symbolSearch,
    symbolSearchCount,
  ] = [
    _getAccounts(credentials),
    _getActivities(credentials),
    _getBalances(credentials),
    _getCandles(credentials),
    _getExecutions(credentials),
    _getMarkets(credentials),
    _getMarketsQuotesStrategies(credentials),
    _getOptionsById(credentials),
    _getOrders(credentials),
    _getOrdersByIds(credentials),
    _getPositions(credentials),
    _getQuotesByIds(credentials),
    // _getQuotesOptionsbyFilterAndIds(credentials),
    _getQuotesOptionsByIds(credentials),
    _getQuotesOptionsFilter(credentials),
    _getServerTime(credentials),
    _getSymbolsByIds(credentials),
    _getSymbolSearchAll(credentials),
    // _getSymbolSearchAndCount(credentials),
    _getSymbolSearch(credentials),
    _getSymbolSearchCount(credentials),
  ];
  // unused for the moment

  return {
    async myBalances() {
      return _myBalances(await balances());
    },
    currentAccount: credentials.accountNumber,
    serverTime: credentials.serverTime || 'ERROR',

    account: {
      getActivities(startTime: string) {
        return activities(startTime);
      },
      getOrders(stateFilter?: string) {
        return orders(stateFilter);
      },

      async getOrdersByIds(orderId: number[]) {
        return ordersByIds(orderId);
      },
      getExecutions(startTime: string) {
        return executions(startTime);
      },
      async getBalances() {
        return balances();
      },
      async getPositions() {
        return positions();
      },
      async getAllAccounts() {
        return accounts();
      },
      async getServerTime() {
        return serverTime();
      },
    },
    market: {
      async getAllMarkets() {
        return markets();
      },
      getCandlesByStockId(symbolID: number) {
        return candles(symbolID);
      },
    },
    getOptionsQuotes: {
      async fromFilter(filters: OptionsFilters) {
        return quotesOptionsFilter(filters);
      },
      async byOptionsIds(optionIds: number[]) {
        return quotesOptionsByIds(optionIds);
      },
    },
    getQuotes: {
      async byStrategies(strategyVariantRequestData: StrategyVariantRequest) {
        return marketsQuotesStrategies(strategyVariantRequestData);
      },

      async byStockIds(ids: number[]) {
        return quotesByIds(ids);
      },
    },

    getOptionChains: {
      async byStockId(stockId: number) {
        return optionsById(stockId);
      },
    },
    getSymbols: {
      async byStockIds(stockIds: number[]) {
        return symbolsByIds(stockIds);
      },
    },
    search: {
      async stock(prefix: string, offset?: number) {
        return symbolSearch(prefix, offset);
        // return symbolSearchAndCount(prefix, offset);
      },
      async allStocks(prefix: string, offset?: number) {
        return symbolSearchAll(prefix, offset);
      },
      async countResults(prefix: string) {
        return symbolSearchCount(prefix);
      },
    },
  };
};
void0(void0);
