import { errorlog, infolog } from '../../resources/side-effects';
import { ApiOptions, Credentials, ProxyFactory_ } from '../../typescript';
import { _getAccounts } from '../api/AccountsCalls/_getAccounts/_getAccounts';
import { _getServerTime } from '../api/AccountsCalls/_getServerTime/_getServerTime';
import { _clientGetApi } from '../routes';
import { _oAuthHttp } from './xx-http-auth-xx';
import { _getPrimaryAccountNumber } from './_getPrimaryAccountNumber';

/** Provide: a token string THEN GET: a 'Promise<Credentials>' */
async function _credentialsFactory(
  apiOptions: ApiOptions,
  proxyFactory?: (() => ProxyFactory_) | undefined,
) {
  let proxy: ProxyFactory_ | undefined;
  let credentials: Credentials;

  if (proxyFactory != null) {
    proxy = proxyFactory();
    if (proxy.oAuthHttpCredentials === true) {
      // proxy exist (is defined) and is autorised to operate will use proxy
      credentials = await _oAuthHttp(apiOptions, proxy);
    } else {
      // proxy exist (is defined) but is not autorised to operate will use null
      credentials = await _oAuthHttp(apiOptions, null);
    }
  } else {
    // proxy does not exist (is undefined or null) will use undefined
    credentials = await _oAuthHttp(apiOptions, undefined);
  }

  try {
    // const
    const accounts = await _getAccounts(_clientGetApi(credentials, proxy))();
    const time = await _getServerTime(_clientGetApi(credentials, proxy))();

    const timZoneOffset = new Date(time).getTimezoneOffset();
    const timZone = -1 * 60 * 1000 * timZoneOffset;
    const serverTime = new Date(time).getTime();
    const expireAt = serverTime + credentials.expiresIn * 1000;

    credentials.expiresAt = new Date(expireAt).toLocaleTimeString();
    credentials.tokenExpiration = new Date(timZone + expireAt);
    credentials.expiresAtRaw = expireAt;
    credentials.serverTime = new Date(timZone + serverTime);
    credentials.serverTimeRaw = serverTime;
    credentials.accountNumber = _getPrimaryAccountNumber(accounts);
    credentials.expiresAt_ = new Date(
      credentials.expiresAtRaw ?? 0,
    ).toLocaleTimeString();
    credentials.serverTime_ = new Date(
      credentials.serverTimeRaw ?? 0,
    ).toLocaleTimeString();

    if (credentials.accountNumber !== '00000000') {
      void infolog<unknown>(
        ` Questrade Server ${time}\n`,
        { Status: 'ready', time },
        '\n\n',
      );
    } else {
      void infolog<unknown>(
        '\n🧐\n🤡 MOCK Server Time:   ',
        new Date().toISOString(),

        '\n🍦 Status: MOCKING!!!\n🤨',
      );
    }
  } catch (error) {
    void errorlog(error.message);
    void infolog<unknown>(credentials.toValue());
    throw new Error('_oAuth Error getting credentials');
  }
  return credentials;
}

export { _credentialsFactory };
