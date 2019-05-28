import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { ArrayWrapper, selectFrom } from '../../vectors';
import { missing } from "../../utils";

const styles = () => ({
  root: {
    display: 'inline-block',
    paddingTop: '2rem',
    margin: '0 20px',
  },
});

class TimePickerPre extends Component {

  constructor(props){
    super(props);

    const {id, defaultValue, options, value} = this.props;
    if (selectFrom(options)
      .select('id')
      .includes(value)
    ) {
      this.state = {value}
    } else {



      this.state = {value: defaultValue}
    }//endif
  }


  render() {
    const {classes, id, label, handleChange, options} = this.props;
    const {value} = this.state;
    return (
      <form className={classes.root} autoComplete="off">
        <TextField
          select
          name={id}
          label={label}
          value={value}
          onChange={handleChange}>
          {options.map(({label, id}) => (
            <MenuItem key={id} value={id}>
              {label}
            </MenuItem>
          ))}
        </TextField>
      </form>
    );
  }
}

TimePickerPre.propTypes = {
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
      })
    ),
    PropTypes.instanceOf(ArrayWrapper),
  ]).isRequired,
};

export default withStyles(styles)(TimePickerPre);
