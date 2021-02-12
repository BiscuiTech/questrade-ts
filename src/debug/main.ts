/* eslint-disable radar/no-unused-collection */
import { questradeAPI } from '..';
import { ech0, echo, getMyToken } from '../resources/side-effects';
import { willGetSNP500StringList } from '../test/development/getSNP500List';
import { id0, void0 } from '../utils';

const once = { onlyOnce: true };

async function main() {
  echo(`Will execute main: ${once.onlyOnce}`);
  if (!once.onlyOnce) {
    return false;
  }

  once.onlyOnce = false;

  const { credentials, qtApi } = await questradeAPI({
    debug: 100,
    token: getMyToken,
  });

  void0(credentials);
  ech0(qtApi);

  const snp500list = id0(await willGetSNP500StringList())
    .slice()
    .map(ech0);
  // snp500list export const cs
  //   .map(stock => qtApi.search.stock(stock))
  //   .map(stock =>
  //     stock.then(s => {
  //       try {
  //         return s[0].symbolId;
  //       } catch (error) {
  //         return 0;
  //       }
  //     }),
  //   )
  //   .map(t =>
  //     t.then(sid => {
  //       try {
  //         return qtApi.getSymbols.byStockIds([sid]);
  //       } catch (error) {
  //         return {} as ISymbol[];
  //       }
  //     }),
  //   );

  // await qtApi.search.stock('couche tard');
  void qtApi;
  void snp500list;

  return true;
}
main();
export { main, main2 };

class Node {
  public next: any;
  constructor(public value: any) {
    this.value = value;
    this.next = null;
  }
}

export class Queue {
  first: any;
  last: any;
  size: number;
  constructor() {
    this.first = null;
    this.last = null;
    this.size = 0;
  }
  enqueue(val: any) {
    const newNode = new Node(val);

    if (!this.first) {
      this.first = newNode;
      this.last = newNode;
    } else {
      this.last.next = newNode;
      this.last = newNode;
    }
    return (this.size += 1);
  }

  dequeue() {
    if (!this.first) {
      return null;
    }

    const temp = this.first;

    if (this.first === this.last) {
      this.last = null;
    }
    this.first = this.first.next;
    this.size -= 1;
    return temp.value;
  }
}

function main2() {
  const myQueue = new Queue();
  const ratio = 11;
  const size = 10_000_000;
  const startEnqueueDecueue = Date.now();

  ech0(`\nDuration for enqueue/dequeue Size (${ratio}×) ${size}:`);
  const startEnqueue = Date.now();

  for (let i = 0; i < size; i++) {
    myQueue.enqueue(i);
  }
  const durationEnqueue = Date.now() - startEnqueue;

  ech0(`Enqueue: ${durationEnqueue / 1000}`);

  const startDequeue = Date.now();

  // let y = 0;

  for (let i = myQueue.size; i > 0; i--) {
    myQueue.dequeue();
  }
  const durationDequeue = Date.now() - startDequeue;

  ech0(`Dequeue: ${durationDequeue / 1000}`);
  const enqueueDecueueDuration = (Date.now() - startEnqueueDecueue) / 1000;

  ech0(`Total for enqueue/dequeue: ${enqueueDecueueDuration}`);
  ech0(`Ratio ${1}`);
  // ----------------------------------------------------------
  // myQueue.enqueue(1);

  const array1 = [];
  const len1 = size / ratio;

  const startPushShift = Date.now();

  ech0(`\nDuration for push/shift (1×) ${len1}:`);
  const startPush = Date.now();

  for (let i = 0; i < len1; i++) {
    array1.push(i);
  }
  const pushDuration = Date.now() - startPush;

  ech0(`Push: ${pushDuration / 1000}`);

  const startShift = Date.now();

  for (let i = array1.length; i > 0; i--) {
    array1.shift();
    // y++;
  }
  const shiftDuration = Date.now() - startShift;

  ech0(`Shift: ${shiftDuration / 1000}`);
  const pushShiftDuration = (Date.now() - startPushShift) / 1000;

  ech0(`Total for push/shift: ${pushShiftDuration}`);
  const ratio1 = enqueueDecueueDuration / (pushShiftDuration * ratio);

  ech0(`Ratio ${ratio1} or ${1 / ratio1}`);

  // ------------------------------------------------------------
  const array2 = [];
  const len2 = size / ratio;
  const startUnShiftPop = Date.now();

  ech0(`\nDuration for unshift/pop (1×) ${len2}:`);
  const startUnshift = Date.now();

  for (let i = 0; i < len2; i++) {
    array2.unshift(i);
  }
  const unshiftDuration = Date.now() - startUnshift;

  ech0(`Unshift: ${unshiftDuration / 1000}`);

  // const startShift = Date.now();
  const startPop = Date.now();

  // let y = 0;
  for (let i = array1.length; i > 0; i--) {
    array1.pop();
    // y++;
  }
  const popDuration = Date.now() - startPop;

  ech0(`Pop: ${popDuration / 1000}`);
  const unShiftPopDuration = (Date.now() - startUnShiftPop) / 1000;

  ech0(`Total for unshift/pop: ${unShiftPopDuration}`);
  const ratio2 = enqueueDecueueDuration / (unShiftPopDuration * ratio);

  ech0(`Ratio ${ratio2} or ${1 / ratio2}`);
}
// main2();
