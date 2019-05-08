/** @format */

import { readFileSync, writeFileSync } from 'fs';
var dist = require('minimist')(process.argv).dist;
var license = require('minimist')(process.argv).license;

function addLicenseToFile(license, destination) {
  if (!license) {
    throw new Error('license path is required as 1st argument');
  }

  addLicenseTextToFile(readFileSync(license).toString(), destination);
}

function addLicenseTextToFile(licenseText, destination) {
  if (!destination) {
    throw new Error('destination file path is required as 2nd argument');
  }

  writeFileSync(
    destination,
    `/**
  @license
  ${licenseText}
 **/
${readFileSync(`${destination}`).toString()}
`
  );
}

export const addLicenseToFile = addLicenseToFile;
export const addLicenseTextToFile = addLicenseTextToFile;
export { dist, license };
