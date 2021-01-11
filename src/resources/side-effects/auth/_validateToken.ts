// TODO: remove dependencies to file system making it optional ...
import { access, constants, readFileSync, writeFileSync } from 'fs';
import path from 'path';

import { _buildCredentialsFromToken } from '../../../private/auth/credentialsFactory';
import { QuestradeAPIOptions } from '../../../typescript';
// TODO: remove dependencies to sync ...
import { sync } from '../../../utils';

const { dirname } = path;

export const _validateToken = (options: QuestradeAPIOptions) => {
  const credentials = _buildCredentialsFromToken(options);
  let refreshToken: string = credentials.seedToken;
  try {
    if (!!credentials.keyFile) {
      sync(dirname(credentials.keyFile));
    } else {
      sync(credentials.keyDir);
    }
    credentials.keyFile =
      credentials.keyFile || `${credentials.keyDir}/${credentials.seedToken}`;
    refreshToken = readFileSync(credentials.keyFile, 'utf8');
  } catch {
    credentials.keyFile =
      credentials.keyFile || `${credentials.keyDir}/${credentials.seedToken}`;
    access(credentials.keyFile, constants.F_OK, async none => {
      if (none) {
        writeFileSync(credentials.keyFile, credentials.seedToken, {
          encoding: 'utf8',
        });
      }
    });
  }
  return { refreshToken, credentials };
};