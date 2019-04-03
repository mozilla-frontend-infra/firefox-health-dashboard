import Date from './dates';
import { Log } from './logs';

class Timer {
  constructor(name) {
    this.name = name;
    this.start = Date.now();
    this.end = null;
    Log.note('Timer {{name}} start at {{start|format("HH:mm:ss.ffffff")}}', {
      name,
      start: this.start,
    });
  }

  done() {
    this.end = Date.now();
    const duration = this.end.subtract(this.start);

    Log.note(
      'Timer {{name}} ends at {{end|format("HH:mm:ss.ffffff")}} ({{duration}})',
      {
        name: this.name,
        end: this.end,
        duration,
      }
    );
  }
}

const timer = name => new Timer(name);

export default timer;
