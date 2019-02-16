class Timeout {
  constructor(milliseconds) {
    this.ready = false;
    this.pending = [];

    setTimeout(() => {
      this.ready = true;
      this.pending.forEach(r => {
        r();
      });
    }, milliseconds);
  }

  then(method) {
    // RUN A METHOD WHEN SIGNALED
    if (this.ready) {
      method();
    } else {
      this.pending.push(method);
    }
  }

  async wait() {
    // STOP UNTIL SIGNALED
    if (this.ready) return;

    const self = this;
    const p = new Promise(resolve => {
      self.pending.push(resolve);
    });

    await p;
  }
}

class Signal {
  constructor() {
    this.ready = false;

    this.pending = [];
  }

  go() {
    // SIGNAL THIS, AND ALL WAITING ON THIS
    if (this.ready) return;
    this.ready = true;
    this.pending.forEach(r => {
      r();
    });
  }

  then(method) {
    // RUN A METHOD WHEN SIGNALED
    if (this.ready) {
      method();
    } else {
      this.pending.push(method);
    }
  }

  async wait(timeout) {
    // SET timeout IF YOU WANT TO SET A LIMIT ON WAIT TIME (Error IS THROWN)
    // STOP UNTIL SIGNALED
    if (this.ready) return;

    const self = this;
    const p = new Promise(resolve => {
      self.pending.push(resolve);
    });

    if (timeout) {
      const t = Timeout(timeout);

      await Signal.or(p, t);

      if (t.ready) throw Error('Timeout');
    } else {
      await p;
    }
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
