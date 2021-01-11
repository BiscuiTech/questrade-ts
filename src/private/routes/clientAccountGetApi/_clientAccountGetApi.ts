import { ClientProxyHandler, Credentials } from '../../../typescript';
import { _coreApiFunction } from '../../core/_coreApiFunction';
import { _endpointFormatAccount } from '..';

// # _clientAccountGetApi
/**
 * YOU PROVIDE: credentials and accountEndpoint string with R return type,
 * THEN YOU GET: ( ) => Promise<R>
 */
export const _clientAccountGetApi = (
  credentials: Credentials,
  proxy?: ClientProxyHandler,
) => <R>(accountEndpoint: string) =>
  _coreApiFunction(credentials, proxy)('GET')(null)<R>(
    _endpointFormatAccount(credentials, proxy)(accountEndpoint),
  );