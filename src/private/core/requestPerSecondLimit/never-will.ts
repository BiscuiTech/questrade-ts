import { void0 } from '../../../utils';

const neverWillCb = (): never => {
  throw new Error(
    'NEVER: lenght is validated prior to pop this should never occur',
  );
};

const neverCb = (error: Error | null, returnValue: any): never => {
  void0({ error, returnValue });
  throw new Error(
    'NEVER: lenght is validated prior to pop this should never occur',
  );
};

export const neverWill = [neverWillCb, neverCb] as const;