import { GMTDate as Date } from './dates';
import { Log } from './logs';

class Timer {
  constructor(name, param = {}) {
    this.name = name;
    this.param = param;
    this.start = Date.now();
    this.end = null;
    Log.note(`Timer ${name} start at {{start|format("HH:mm:ss.ffffff")}}`, {
      start: this.start,
      ...param,
    });
  }

  done() {
    this.end = Date.now();
    const duration = this.end.subtract(this.start);

    Log.note(
      `Timer ${
        this.name
      } ends at {{end|format("HH:mm:ss.ffffff")}} ({{duration}})`,
      {
        end: this.end,
        duration,
        ...this.param,
      },
    );
  }
}

const timer = (name, param) => new Timer(name, param);

export default timer;
