import { AxiosStatic, default as axios } from 'axios';
import { _axiosGetApi } from '../../..';
import { ICandle, ICandles } from '../../../../typescript';
import { Credentials } from '../../../typescript';

// + _getCandles
/** _getCandles */
export const _getCandles = (_axios: AxiosStatic = axios) => (
  credentials: Credentials
) => (startDate: string) => (endDate: string) => (
  interval: string = 'OneDay'
) => async (symbolID: number): Promise<ICandle[]> =>
  (await _axiosGetApi(_axios)(credentials)<ICandles>(
    `/markets/candles/${symbolID}?startTime=${startDate}&endTime=${endDate}&interval=${interval}`
  )()).candles;