import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MuiSlider from '@material-ui/lab/Slider';
import { ArrayWrapper, selectFrom } from '../../vectors';
import { coalesce, toArray } from '../../utils';

const QUERY_TIME_FORMAT = 'yyyy-MM-dd';
const styles = () => ({
  root: {
    display: 'inline-block',
    verticalAlign: 'bottom',
    position: 'relative',
    paddingTop: '2rem',
    margin: '0 20px',
  },
  label: {
    display: 'block',
    whiteSpace: 'nowrap',
    padding: '0 0 0.5rem 0',
    fontSize: '0.8rem',
    color: '#757575',
    textAlign: 'left',
  },
  value: {
    display: 'block',
    whiteSpace: 'nowrap',
    padding: '0 10px 0.5rem 0',
    fontSize: '1rem',
    color: '#444444',
    textAlign: 'left',
  },
  slider: {
    display: 'block',
    padding: '1rem 0 0 0',
    height: '2rem',
    position: 'absolute',
    bottom: 0,
  },
});

class DurationPickerPre extends Component {
  constructor(props) {
    super(props);

    const { value, id } = props;
    const width = coalesce(props.width, '8rem');
    const options = toArray(props.options);
    const range = { min: 0, max: options.length - 1, step: 1 };
    const index = options.findIndex(({ id }) => id === value);

    this.state = {
      index,
      range,
      options,
      event: { target: { name: id, value } },
      width,
    };
  }

  handleChange = (event, index) => {
    this.setState({ event, index });
  };

  handleDragEnd = () => {
    const { event, index } = this.state;

    event.target.name = this.props.id;
    event.target.value = this.state.options[index].id;
    this.props.handleChange(event);
  };

  render() {
    const { classes, id, label } = this.props;
    const { index, range, width } = this.state;
    const option = this.state.options[index];

    return (
      <form className={classes.root} style={{ width }} autoComplete="off">
        <InputLabel className={classes.label} htmlFor={id}>
          {label}
        </InputLabel>
        <div className={classes.value}>{option.label}</div>
        <MuiSlider
          value={index}
          min={range.min}
          max={range.max}
          step={range.step}
          onChange={this.handleChange}
          onDragEnd={this.handleDragEnd}
        />
      </form>
    );
  }
}

/*
ENSURE THE options ARE UPDATED
RETURN CORRECTED VALUE
 */
DurationPickerPre.prepare = (props) => {
  const { options, value, defaultValue } = props;

  if (
    selectFrom(options)
      .select('id')
      .includes(value)
  ) {
    return value;
  }

  return defaultValue;
};

DurationPickerPre.propTypes = {
  classes: PropTypes.shape().isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  handleChange: PropTypes.func.isRequired,
  options: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
      }),
    ),
    PropTypes.instanceOf(ArrayWrapper),
  ]).isRequired,
  width: PropTypes.string,
};

const DurationPicker = withStyles(styles)(DurationPickerPre);

export { DurationPicker, QUERY_TIME_FORMAT };
