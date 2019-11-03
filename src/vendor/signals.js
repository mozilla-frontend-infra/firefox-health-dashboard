import { Log } from './logs';
import { GMTDate } from './dates';

function sleep(seconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

const delayedValue = () => {
  // return a Promise to a value
  // this.resolve(value) to assign the value when available
  let selfResolve = null;
  let selfReject = null;
  const self = new Promise((resolve, reject) => {
    selfResolve = resolve;
    selfReject = reject;
  });

  self.resolve = selfResolve;
  self.reject = selfReject;

  return self;
};

/*
Binary, unidirectional, signal
Signal starts as `false` and can be triggered to be `true`, it can not go back to `false`.
use `go()` to trigger the signal
attach dependnecies to signal, or wait on signal to continue async functions.
 */
class Signal {
  constructor() {
    this.done = false;
    this.waiting = [];
  }

  valueOf() {
    return this.done;
  }

  /*
    Execute `func` when signalled, once and only once.
    If already signalled, then `func` is executed immediately
    Each call to then() adds to the list of work to be done
     */
  then(func) {
    if (this.done) {
      func();
    } else {
      this.waiting.push(func);
    }
  }

  /*
    Trigger this signal
     */
  go() {
    if (this.done) return;
    this.done = true;

    this.waiting.forEach((func) => {
      try {
        func();
      } catch (e) {
        Log.warning('failure during execution of function', e);
      }
    });
    this.waiting = [];
  }

  /*
    Let async function sleep until signalled
    return a Promise that will resolve when signalled

    ```
        const s = new Signal();
        ...
        await s.wait();
    ```
     */
  async wait() {
    return new Promise((resolve) => {
      this.waiting.push(resolve);
    });
  }
}

/*
A signal based on a timeout
 */
class Timer extends Signal {
  constructor(timeoutInSeconds) {
    super();
    let timer;
    if (timeoutInSeconds instanceof GMTDate) {
      timer = setTimeout(() => this.go(), (timeoutInSeconds.unix() - GMTDate.now().unix()) * 1000);
    } else {
      timer = setTimeout(() => this.go(), timeoutInSeconds * 1000);
    }
    this.then(() => clearTimeout(timer));
  }
}


export {
  sleep, delayedValue, Signal, Timer,
};
