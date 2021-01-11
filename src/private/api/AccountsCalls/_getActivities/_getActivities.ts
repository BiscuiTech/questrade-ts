import { IAccountActivity, IActivities, Logger } from '../../../../typescript';
import { endpointFormatDateTool } from '../../../../utils';

// + _getActivities
/** PROVIDE: credentials, startTime string and endTime string THEN GET: a 'Promise<IAccountActivity[]>' */
export const _getActivities = (
  accountGetApi: <R>(accountEndpoint: string) => () => Promise<R>,
  errorlog: Logger = (...error: any[]) => error,
) => {
  return (startTime: string) => {
    //
    return async (endTime: string): Promise<IAccountActivity[]> => {
      try {
        const dateTime = endpointFormatDateTool(startTime, endTime);
        const endpoint = `/activities?${dateTime}`;

        const accountGet = accountGetApi<IActivities>(endpoint);
        const activities = await accountGet();

        return activities.activities;
      } catch (error) {
        void errorlog(error);
        return [];
      }
    };
  };
};
