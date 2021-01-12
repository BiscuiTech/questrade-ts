import {
  echo,
  getHttpClient,
  validateToken,
  writeToken,
} from '../../../resources/side-effects';
import {
  ClientRequestConfig,
  ClientResponse,
} from '../../../resources/side-effects/typescript';
import {
  ClientProxyHandler,
  Credentials,
  IRefreshCreds,
  QuestradeAPIOptions,
} from '../../../typescript';

// !!!
// XXX: const {echo, getHttpClient, validateToken, writeToken,} = sideEffects;

export const _oAuthHttpCredentials = async (
  options: QuestradeAPIOptions,
  proxy?: ClientProxyHandler,
): Promise<Credentials> => {
  const { refreshToken, credentials } = validateToken(options);
  const _config: ClientRequestConfig = {
    method: 'GET',
    params: {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    },
    url: `${credentials.authUrl}/oauth2/token`,
  };

  let httpClient: ClientProxyHandler = getHttpClient();
  if (proxy?.httpDataEndPointConnector && proxy?.activate) {
    echo('using proxy in oAuth connector');

    httpClient = proxy.activate();
  }

  let response: ClientResponse<IRefreshCreds>;
  response = (await httpClient(_config)) as any;

  if (!response.data) {
    if (response) {
      void echo<unknown>('________________________________________________');
      void echo<unknown>(response.status, response.statusText);
      void echo<unknown>(response.headers);
      void echo<unknown>(response.request);
      void echo<unknown>(response.status, response.statusText);
      void echo<unknown>('________________________________________________');
      void echo<unknown>('++++++++++++++++++++++++++++++++++++++++++++++++');
    }
    throw new Error(
      '!! validate credntials Invalid data back from http client',
    );
  }

  return writeToken(credentials, response);
};
