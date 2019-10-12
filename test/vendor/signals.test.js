import { Signal } from '../../src/vendor/signals';

describe('signals', () => {
  it('mutiple then are triggered', () => {
    const s = new Signal();
    let a = false;
    let b = false;
    s.then(() => {a = true;});
    s.then(() => {b = true;});

    expect(a).toEqual(false);
    expect(b).toEqual(false);

    s.go();

    expect(a).toEqual(true);
    expect(b).toEqual(true);
  });

  it('mutiple go trigger only once', () => {
    const s = new Signal();
    let a = 0;
    s.then(() => {a += 1;});
    expect(a).toEqual(0);

    s.go();
    expect(a).toEqual(1);

    s.go();
    expect(a).toEqual(1);

    s.go();
    expect(a).toEqual(1);
  });

  it('then after go to trigger immediately', () => {
    const s = new Signal();
    s.go();

    let a = 0;
    s.then(() => {a += 1;});
    expect(a).toEqual(1);
  });

  it('go() does not throw an error', () => {
    const s = new Signal();
    s.then(() => {return 1 / 0;});
    s.go();
    expect(s.done).toEqual(true);
  });

  it('promise waits until go', async () => {
    const s = new Signal();
    let a = 0;

    const waiter = (
      async () => {
        a += 1;
        await s.wait();
        a += 1;
      }
    )();

    expect(a).toEqual(1);
    s.go();
    await waiter;
    expect(a).toEqual(2);
  });

  it('serial signals work as expected', async () => {
    const s = new Signal();
    const t = new Signal();
    let a = 0;

    (
      async () => {
        a += 1;
        await s.wait();
        a += 1;
        t.go();
      }
    )();

    expect(a).toEqual(1);
    s.go();
    await t.wait();
    expect(a).toEqual(2);
  });


  it('signal.done works as a decision value', () => {
    const s = new Signal();


    if (s.done) {
      throw new Error("not expected");
    }

    s.go();

    if (!s.done) {
      throw new Error("not expected");
    }
  });

  it('signal works as a decision value, kinda', () => {
    const s = new Signal();


    if (s == true) {
      throw new Error("not expected");
    }

    if (+s) {
      throw new Error("not expected");
    }

    s.go();

    if (!s) {
      throw new Error("not expected");
    }
  });


});
