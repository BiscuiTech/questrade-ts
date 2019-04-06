/** @format */
import { EventEmitter as EE } from 'events';
import { readFile, writeFile } from 'fs';
import { chain, keyBy, pick } from 'lodash';
import { sync } from 'mkdirp';
import { default as moment } from 'moment';
import { dirname } from 'path';
import { default as request } from 'request-promise-native';
import { promisify } from 'util';
type seedToken = string;
type keyFile = any;
interface IQuestradeOpts {
  test?: boolean;
  keyDir?: string;
  apiVersion: string;
  keyFile?: string;
  seedToken?: string;
  account?: any;
}
type QuestradeClassOptions = IQuestradeOpts | seedToken | keyFile;
type error = Error | null;

export class QuestradeClass extends EE {
  public seedToken: string;
  private _accessToken: string;
  private _test: boolean;
  private _keyDir: string;
  private _apiVersion: string;
  private _keyFile: string;
  private _account: string;
  private _apiServer: string;
  private _refreshToken: string;
  private _apiUrl: string;
  private _authUrl: string;
  public constructor(opts?: QuestradeClassOptions) {
    super();
    this._test = false;
    this._keyDir = './keys';
    this._apiVersion = 'v1';
    this._keyFile = '';
    this.seedToken = '';
    this._account = '';

    if (typeof opts === 'undefined' || opts === undefined) {
      throw new Error('questrade_missing_api_key or options');
    }
    if (typeof opts === 'string' && opts.indexOf('/') !== -1) {
      this._keyFile = opts;
    }

    if (typeof opts === 'string' && opts.indexOf('/') === -1) {
      this.seedToken = opts;
    }

    if (typeof opts === 'object') {
      // Set to true if using a practice account
      // (http://www.questrade.com/api/free-practice-account)
      this._test = opts.test === undefined ? false : !!opts.test;
      // Directory where the last refreshToken is stored.
      // The file name will have to be seedToken
      this._keyDir = opts.keyDir || './keys';
      // Used as part of the API URL
      this._apiVersion = opts.apiVersion || 'v1';
      // File that stores the last refreshToken.
      // Not really neede if you keep the seedToken and the keyDir
      this._keyFile = opts.keyFile || '';
      // The original token obtained mannuelly from the interface
      this.seedToken = opts.seedToken || '';
      // The default Account agains wich the API are made.
      // GetAccounts() will return the possible values
      this._account = opts.account || '';
    }
    // The refresh token used to login and get the new accessToken,
    // the new refreshToken (next time to log in) and the api_server
    this._refreshToken = '';
    // Stores The unique token that is used to call each API call,
    //  Changes everytime you Refresh Tokens (aka Login)
    this._accessToken = '';
    // The server your connection needs to be made to (changes sometimes)
    // this._apiServer = '';
    // Strores the URL (without the endpoint) to use for regular GET/POST Apis
    this._apiUrl = 'https://api01.iq.questrade.com/v1';
    this._apiServer = '';
    this._authUrl = this._test
      ? 'https://practicelogin.questrade.com'
      : 'https://login.questrade.com';

    // Running the Authentification process and emit 'ready' when done
    console.log(this._apiServer);
    if (!!this._account) this.emit('ready');

    this.setPrimaryAccount()
      .then(() => this.emit('ready'))
      .catch((setPrimaryAccountErr: error) =>
        this.emit('error', {
          details: setPrimaryAccountErr,
          message: 'failed_to_set_account',
        })
      );
    this.emit('ready');

    this._loadKey();
    this._refreshKey();
    this.emit('ready');
  }

  public setPrimaryAccount = async () => {
    const accounts: any = await this.getAccounts();
    if (!accounts || !Object.keys(accounts).length) {
      throw new Error('no_accounts_found');
    }
    const primaryAccount = Object.keys(accounts).filter(
      (accountNumber: any) => {
        return accounts[accountNumber].isPrimary;
      }
    );
    if (!primaryAccount.length) {
      throw new Error('no_primary_account');
    }
    this._account = primaryAccount[0];
    return this._account;
  };

  public getAccounts = async () => {
    return this._api('GET', '/accounts', (err: error, response: any) => {
      if (err) throw err;
      return keyBy(response.accounts, 'number');
    });
  };

  public getPositions = async () => {
    return this._accountApi('GET', '/positions');
  };

  public getBalances = async () => {
    return this._accountApi('GET', '/balances');
  };

  public getExecutions = async () => {
    return this._accountApi('GET', '/executions');
  };

  public getOrder = async (id: any) => {
    const response: any = await this._accountApi('GET', `/orders/${id}`);

    if (!response.orders.length) {
      throw Error('order_not_found');
    }
    return response.orders[0];
  };

  public getOrders = async (ids: any) => {
    if (!Array.isArray(ids)) {
      throw new Error('missing_ids');
    }
    if (!ids.length) return {};
    const response: any = await this._accountApi('GET', '/orders', {
      ids: ids.join(','),
    });

    return keyBy(response.orders, 'id');
  };

  public getOpenOrders = async () => {
    const response: any = await this._accountApi('GET', '/orders', {
      stateFilter: 'Open',
    });

    keyBy(response.orders, 'id');
  };

  public getAllOrders = async () => {
    const acountResponse: any = await this._accountApi('GET', '/orders', {
      stateFilter: 'All',
    });
    return keyBy(acountResponse.orders, 'id');
  };

  public getClosedOrders = async () => {
    const response: any = await this._accountApi('GET', '/orders', {
      stateFilter: 'Closed',
    });

    return keyBy(response.orders, 'id');
  };

  public getActivities = async (opts_: any) => {
    const opts = opts_ || {};
    if (opts.startTime && !moment(opts.startTime).isValid()) {
      throw new Error('start_time_invalid');
    }
    if (opts.endTime && !moment(opts.endTime).isValid()) {
      throw new Error('end_time_invalid');
    }
    const startTime = opts.startTime
      ? moment(opts.startTime).toISOString()
      : moment()
          .startOf('day')
          .subtract(30, 'days')
          .toISOString();
    const endTime = opts.endTime
      ? moment(opts.endTime).toISOString()
      : moment().toISOString();
    this._accountApi('GET', '/activities', {
      endTime,
      startTime,
    });
  };

  public getSymbol = async (id: any) => {
    let params: any = false;
    if (typeof id === 'number') {
      params = {
        id,
      };
    } else if (typeof id === 'string') {
      params = {
        names: id,
      };
    }
    if (params === false) {
      throw new Error('missing_id');
    }
    const response: any = this._api('GET', '/symbols', params);

    return response.symbols[0];
  };

  public getSymbols = async (ids: any) => {
    if (!Array.isArray(ids)) {
      throw new Error('missing_ids');
    }
    if (!ids.length) return {};
    let params: any = false;
    if (typeof ids[0] === 'number') {
      params = {
        ids: ids.join(','),
      };
    } else if (typeof ids[0] === 'string') {
      params = {
        names: ids.join(','),
      };
    }
    if (params === false) {
      throw new Error('missing_id');
    }
    const response: any = await this._api('GET', '/symbols', params);

    if (!response.symbols.length) {
      throw new Error('symbols_not_found');
    }
    return keyBy(response.symbols, params.names ? 'symbol' : 'symbolId');
  };

  public search = async (query: any, offset: any) => {
    if (typeof query !== 'string') {
      throw new Error('missing_query');
    }
    const response: any = await this._api('GET', '/symbols/search', {
      offset,
      prefix: query,
    });

    return response.symbols;
  };

  public getOptionChain = async (symbolId: any) => {
    const response: any = await this._api(
      'GET',
      `/symbols/${symbolId}/options`
    );

    return chain(response.optionChain)
      .keyBy('expiryDate')
      .mapValues(option => {
        return keyBy(option.chainPerRoot[0].chainPerStrikePrice, 'strikePrice');
      })
      .value();
  };

  public getMarkets = async () => {
    const response: any = await this._api('GET', '/markets');

    return keyBy(response.markets, 'name');
  };

  public getQuote = async (id: string) => {
    const response: any = await this._api('GET', `/markets/quotes/${id}`);

    if (!response.quotes) {
      return {
        message: 'quote_not_found',
        symbol: id,
      };
    }
    return response.quotes[0];
  };

  public getQuotes = async (ids: any) => {
    if (!Array.isArray(ids)) {
      throw new Error('missing_ids');
    }
    if (!ids.length) return {};
    const response: any = await this._api('GET', '/markets/quotes', {
      ids: ids.join(','),
    });

    return keyBy(response.quotes, 'symbolId');
  };

  public getOptionQuote = async (filters_: any[]) => {
    let filters = filters_;
    if (!Array.isArray(filters) && typeof filters === 'object') {
      filters = [filters];
    }
    const response: any = await this._api('POST', '/markets/quotes/options', {
      filters,
    });

    return response.optionQuotes;
  };

  public getOptionQuoteSimplified = async (filters: any) => {
    const optionsQuotes = await this.getOptionQuote(filters);

    return chain(optionsQuotes)
      .map(optionQuote => {
        const parsedSymbol = optionQuote.symbol.match(
          /^([a-zA-Z]+)(.+)(C|P)(\d+\.\d+)$/
        );
        if (parsedSymbol.length >= 5) {
          const parsedDate = parsedSymbol[2].match(/^(\d+)([a-zA-Z]+)(\d+)$/);
          const expiryDate: any = moment()
            .utc()
            .month(parsedDate[2])
            .date(parsedDate[1])
            .year(20 + parsedDate[3])
            .startOf('day');
          const expiryString = `${expiryDate
            .toISOString()
            .slice(0, -1)}000-04:00`;
          optionQuote.underlying = parsedSymbol[1];
          optionQuote.expiryDate = expiryString;
          optionQuote.strikePrice = parseFloat(parsedSymbol[4]);
          optionQuote.optionType = parsedSymbol[3] === 'P' ? 'Put' : 'Call';
        }
        return optionQuote;
      })
      .groupBy('underlying')
      .mapValues(underlyingQuotes => {
        return chain(underlyingQuotes)
          .groupBy('optionType')
          .mapValues(optionTypeQuotes => {
            return chain(optionTypeQuotes)
              .groupBy('expiryDate')
              .mapValues(expiryDateQuotes => {
                return chain(expiryDateQuotes)
                  .keyBy(quote => {
                    return quote.strikePrice.toFixed(2);
                  })
                  .mapValues(quote => {
                    return pick(quote, [
                      'symbol',
                      'symbolId',
                      'lastTradePrice',
                    ]);
                  })
                  .value();
              })
              .value();
          })
          .value();
      })
      .value();
  };

  public getCandles = async (id: string, opts?: any) => {
    const opt: any = opts || {};

    if (opt.startTime && !moment(opt.startTime).isValid()) {
      throw new Error('start_time_invalid');
    }
    // details: opt.startTime,

    if (opt.endTime && !moment(opt.endTime).isValid()) {
      throw new Error('end_time_invalid');
    }
    const startTime = opt.startTime
      ? moment(opt.startTime).toISOString()
      : moment()
          .startOf('day')
          .subtract(30, 'days')
          .toISOString();
    const endTime = opt.endTime
      ? moment(opt.endTime).toISOString()
      : moment().toISOString();

    const response: any = this._api('GET', `/markets/candles/${id}`, {
      endTime,
      interval: opt.interval || 'OneDay',
      startTime,
    });

    return response.candles;
  };

  public createOrder = async (opts: any) => {
    return this._accountApi('POST', '/orders', opts);
  };

  public updateOrder = async (id: string, opts: any) => {
    return this._accountApi('POST', `/orders/${id}`, opts);
  };

  public testOrder = async (opts: any) => {
    return this._accountApi('POST', '/orders/impact', opts);
  };

  public removeOrder = async (id: string) => {
    return this._accountApi('DELETE', `/orders/${id}`);
  };

  public createStrategy = async (opts: any) => {
    return this._accountApi('POST', '/orders/strategy', opts);
  };

  public testStrategy = async (opts: any) => {
    return this._accountApi('POST', '/orders/strategy/impact', opts);
  };
  private _saveKey = async () => {
    const writeFile_ = promisify(writeFile);

    try {
      writeFile_(this._getKeyFile(), this._refreshToken, 'utf8');
    } catch (error) {
      throw new Error('failed_to_write');
    }
    return this._refreshToken;
  };

  // Gets name of the file where the refreshToken is stored
  private _getKeyFile = () => {
    return this._keyFile || `${this._keyDir}/${this.seedToken}`;
  };

  // Reads the refreshToken stored in the file (if it exist)
  // otherwise uses the seedToken
  private _loadKey = async () => {
    if (this._keyFile) {
      sync(dirname(this._keyFile)); // Synchronously create a new directory
    } else {
      sync(this._keyDir);
    }

    const readFile_ = promisify(readFile);
    const refreshToken: any = await readFile_(this._getKeyFile(), 'utf8');

    if (!refreshToken) {
      this._refreshToken = this.seedToken;
      this._saveKey();
    }
    this._refreshToken = refreshToken;
    return refreshToken;
  };

  // Refreshed the tokem (aka Logs in) using the latest RefreshToken
  // (or the SeedToken if no previous saved file)
  private _refreshKey = async () => {
    const data = {
      grant_type: 'refresh_token',
      refresh_token: this._refreshToken,
    };
    const res = await request({
      method: 'POST',
      qs: data,
      url: `${this._authUrl}/oauth2/token`,
    });

    try {
      const creds = await JSON.parse(await res.body);
      this._apiServer = creds.api_server;
      this._apiUrl = creds.api_server + this._apiVersion;
      this._accessToken = creds.access_token;
      this._refreshToken = creds.refresh_token;
      this._saveKey();
      this.emit('refresh', this._refreshToken);
    } catch (e) {
      console.log('E:', e);
    }
  };

  // Method that actually mades the GET/POST request to Questrade
  private _api = async (
    method?: string,
    endpoint?: string | number,
    params?: any
  ) => {
    const url: string = this._apiUrl + endpoint;
    const opts: any = {
      auth: {
        bearer: this._accessToken,
      },
      method,
      url,
    };
    if (method === 'GET') {
      opts.qs = params || {};
      opts.json = true;
    } else {
      opts.json = params || true;
    }

    return request(opts);
  };

  // Method that appends the set account to the API calls so all calls
  // are made to that account. Chage this.account to change the account used
  private _accountApi = async (method?: any, endpoint?: any, params?: any) => {
    if (!this._account) {
      throw new Error('no_account_selected');
    }
    return this._api(method, `/accounts/${this._account}${endpoint}`, params);
  };
}
