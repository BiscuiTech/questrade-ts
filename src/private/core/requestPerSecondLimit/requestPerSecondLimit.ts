// tslint:disable: prefer-array-literal
// tslint:disable: only-arrow-functions
// tslint:disable: promise-function-async
// tslint:disable: no-any
// tslint:disable: no-any
// tslint:disable: ban-types
// tslint:disable: ter-prefer-arrow-callback
import { perSeconds, void0 } from '../../../utils';

function requestLimiterFactory() {
  let isCalled = false;
  const callsQueue: Array<[Function, CallBack]> = [];
  return function requestLimiter(fn: Function, hertz: number = 1) {
    const callToPop = async function(): Promise<void> {
      if (callsQueue.length >= 1 && !isCalled) {
        isCalled = true;
        setTimeout(async function(): Promise<void> {
          isCalled = false;
          await callToPop();
          return void 0;
        }, perSeconds(hertz));
        const poped = callsQueue.pop();
        const [myfn, mycb] = !!poped ? poped : [neverWillCb, neverCb];
        mycb(null, myfn());
        return void 0;
      }
      return void 0;
    };

    return async function addToQueue(cb: CallBack): Promise<void> {
      callsQueue.unshift([fn, cb]);
      callToPop();
      return void 0;
    };
  };
}

export const myPromisify = <T>(addToQueue: (cb: CallBack) => Promise<void>) => {
  return new Promise<T>((resolve, reject) => {
    addToQueue((error, result) => {
      if (!!error) {
        console.error(error);

        reject(error);
        return void 0;
      }
      resolve(result);
      return void 0;
    });
  });
};

function limitingRequest(limiterFactory: ReqLimiterFactory) {
  const requestLimiter = limiterFactory();
  return (hz: number) => async <T>(fn: () => T) => {
    const addToQueue = requestLimiter(fn, hz);
    return myPromisify<T>(addToQueue);
  };
}

const neverWillCb = async () => {
  void0();
  throw new Error(
    'NEVER: lenght is validated prior to pop this should never occur'
  );
};
const neverCb = (error: Error | null, returnValue: any) => {
  void0({ returnValue, error });
  throw new Error(
    'NEVER: lenght is validated prior to pop this should never occur'
  );
};

export const requestPerSecondLimit = limitingRequest(requestLimiterFactory);

export type CallBack = (error: Error | null, returnValue: Promise<any>) => void;
export type ReqLimiterFactory = () => (
  fn: Function,
  hertz?: number
) => (cb: CallBack) => Promise<void>;
