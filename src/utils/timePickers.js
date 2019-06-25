import {
  DurationPicker,
  QUERY_TIME_FORMAT,
} from '../vendor/components/navigation/DurationPicker';
import TimePicker from '../vendor/components/navigation/TimePicker';
import { Date } from '../vendor/dates';

const todayText = Date.today().format(QUERY_TIME_FORMAT);
const timePickers = [
  {
    type: DurationPicker,
    id: 'past',
    label: 'Show past',
    defaultValue: 'month',
    options: [
      { id: 'day', label: '1 day' },
      { id: '2day', label: '2 days' },
      { id: 'week', label: 'week' },
      { id: '2week', label: '2 weeks' },
      { id: 'month', label: 'month' },
      { id: '3month', label: '3 months' },
      { id: 'year', label: 'year' },
    ],
  },
  {
    type: TimePicker,
    id: 'ending',
    label: 'Ending',
    defaultValue: todayText,
    options: [{ id: todayText, label: 'Today' }],
  },
];

// This is config for the time pickers; which is the same in all
// the components that use them.
export { timePickers, todayText };
