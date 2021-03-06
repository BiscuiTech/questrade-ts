import { AxiosResponse } from 'axios';
import { writeFileSync } from 'fs';
import { Credentials, IRefreshCreds } from '../../../typescript';

export const _writeToken = (
  credentials: Credentials,
  response: AxiosResponse<IRefreshCreds>
): Credentials => {
  const { data: refreshCreds } = response;
  credentials.accessToken = refreshCreds.access_token;
  credentials.apiServer = refreshCreds.api_server;
  credentials.expiresIn = refreshCreds.expires_in;
  credentials.refreshToken = refreshCreds.refresh_token;
  credentials.tokenType = refreshCreds.token_type;
  credentials.apiUrl = `${credentials.apiServer}${credentials.apiVersion}`;
  writeFileSync(credentials.keyFile, credentials.refreshToken, 'utf8');

  return credentials;
};
