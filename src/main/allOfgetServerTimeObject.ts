/** @format */

import { QuestradeClass } from '../core/types';

export async function allOfgetServerTimeObject(qt: QuestradeClass) {
  const getServerTimeObject = await qt.getServerTimeObject();
  const getServerTime = await qt.getServerTime;
  console.log('\n\n\n\nGETSERVERTIME:');
  console.log('\n\ngetServerTime:');
  console.log(getServerTime);
  console.log('serverTime:');
  console.dir(getServerTimeObject.serverTime);
  console.log('UTC:');
  console.dir(getServerTimeObject.UTC);
  console.log('timeObject.years:');
  console.dir(getServerTimeObject.timeObject.years);
  console.log('timeObject.months:');
  console.dir(getServerTimeObject.timeObject.months);
  console.log('timeObject.date:');
  console.dir(getServerTimeObject.timeObject.date);
  console.log('timeObject.hours:');
  console.dir(getServerTimeObject.timeObject.hours);
  console.log('timeObject.minutes:');
  console.dir(getServerTimeObject.timeObject.minutes);
  console.log('timeObject.seconds:');
  console.dir(getServerTimeObject.timeObject.seconds);
  console.log('timeObject.milliseconds:');
  console.dir(getServerTimeObject.timeObject.milliseconds);
  console.log('toUTCDate:');
  console.dir(getServerTimeObject.toUTCDate);
  console.log('toArray:');
  console.dir(getServerTimeObject.toArray);
  console.log('date.day:');
  console.dir(getServerTimeObject.date.day);
  console.log('date.date:');
  console.dir(getServerTimeObject.date.date);
  console.log('date.month:');
  console.dir(getServerTimeObject.date.month);
  console.log('date.year:');
  console.dir(getServerTimeObject.date.year);
  console.log('time.hour:');
  console.dir(getServerTimeObject.time.hour);
  console.log('time.minute:');
  console.dir(getServerTimeObject.time.minute);
  console.log('time.second:');
  console.dir(getServerTimeObject.time.second);
  console.log('time.milliseconds:');
  console.dir(getServerTimeObject.time.milliseconds);
  console.log('time.unixmilliseconds:');
  console.dir(getServerTimeObject.time.unixmilliseconds);
  console.log('time.unix:');
  console.dir(getServerTimeObject.time.unix);
  console.log('time.utcOffset:');
  console.dir(getServerTimeObject.time.utcOffset);
  console.log('isValid:');
  console.dir(getServerTimeObject.isValid);
  console.log('dayOfYear:');
  console.dir(getServerTimeObject.dayOfYear);
  console.log('weekOfTheYeay:');
  console.dir(getServerTimeObject.weekOfTheYeay);
  console.log('weekday:');
  console.dir(getServerTimeObject.weekday);
  console.log('isLeapYear:');
  console.dir(getServerTimeObject.isLeapYear);
  console.log('daysInMonth:');
  console.dir(getServerTimeObject.daysInMonth);
  console.log('weeksInYear:');
  console.dir(getServerTimeObject.weeksInYear);
  console.log('quarter:');
  console.dir(getServerTimeObject.quarter);
  console.log('locale:');
  console.dir(getServerTimeObject.locale);
  return getServerTimeObject;
}
