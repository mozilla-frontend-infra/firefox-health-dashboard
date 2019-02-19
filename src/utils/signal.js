class Timeout {
  constructor(milliseconds) {
    const self = this;

    this.ready = false;
    this.promise = new Promise(resolve => {
      self.resolve = resolve;
    });

    setTimeout(() => {
      this.ready = true;
      this.resolve();
    }, milliseconds);
  }

  then(method) {
    this.promise.then(method);
  }

  async wait() {
    await this.promise;
  }
}

class Signal {
  constructor() {
    const self = this;

    this.ready = false;
    this.promise = new Promise(resolve => {
      self.resolve = resolve;
    });
  }

  go() {
    // SIGNAL THIS, AND ALL WAITING ON THIS
    if (this.ready) return;
    this.ready = true;
    this.resolve();
  }

  then(method) {
    // RUN A METHOD WHEN SIGNALED
    this.promise.then(method);
  }

  async wait() {
    // SET timeout IF YOU WANT TO SET A LIMIT ON WAIT TIME (Error IS THROWN)
    // STOP UNTIL SIGNALED
    await this.promise;
  }
}

Signal.and = function and(...signals) {
  let remaining = signals.length;
  const output = new Signal();

  signals.forEach(s => {
    s.then(() => {
      remaining -= 1;

      if (remaining === 0) output.go();
    });
  });

  return output;
};

Signal.or = function or(...signals) {
  const output = new Signal();

  signals.forEach(s => {
    s.then(output.go);
  });

  return output;
};

export { Signal, Timeout };
