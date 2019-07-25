import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { ArrayWrapper, selectFrom } from '../../vectors';
import { missing } from '../../utils';
import { GMTDate as Date } from '../../dates';

const styles = () => ({
  root: {
    display: 'inline-block',
    paddingTop: '2rem',
    margin: '0 20px',
  },
});

class TimePicker extends Component {
  constructor(props) {
    super(props);

    const { value } = this.props;

    this.state = { value };
  }

  render() {
    const {
      classes, id, label, handleChange, options,
    } = this.props;
    const { value } = this.state;

    // no need to show a picker if there are no choices
    if (options.length < 2) return null;

    return (
      <form className={classes.root} autoComplete="off">
        <TextField
          select
          name={id}
          label={label}
          value={value}
          onChange={handleChange}
        >
          {options.map(({ label, id }) => (
            <MenuItem key={id} value={id}>
              {label}
            </MenuItem>
          ))}
        </TextField>
      </form>
    );
  }
}

/*
ENSURE THE options ARE UPDATED
RETURN CORRECTED VALUE
 */
TimePicker.prepare = (props) => {
  const { options, value, defaultValue } = props;

  if (missing(value)) return defaultValue;

  if (
    selectFrom(options)
      .select('id')
      .includes(value)
  ) return value;

  // THIS PICKER WILL TAKE THE URL VALUE AND ADD IT AS A SELECTABLE VALUE
  options.push({
    id: value,
    label: Date.newInstance(value).format('MMM dd, yyyy'),
  });

  return value;
};

TimePicker.propTypes = {
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
};

export default withStyles(styles)(TimePicker);
