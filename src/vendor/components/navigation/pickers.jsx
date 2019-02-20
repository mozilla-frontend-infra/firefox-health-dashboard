import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Picker from './picker';
import { toPairs } from '../../queryOps';

const CONFIG = {};
const styles = () => ({
  root: {
    display: 'flex',
    textAlign: 'center',
    padding: '15px',
  },
});
const Pickers = ({ classes, benchmark, onChange, platform }) => (
  <div className={classes.root}>
    <Picker
      key="Platform selection"
      identifier="platform"
      topLabel="Platform"
      onSelection={onChange}
      selectedValue={platform}
      options={toPairs(CONFIG.views)
        .select({ value: 'id', label: 'label' })
        .toArray()}
    />
    <Picker
      key="Benchmark selection"
      identifier="benchmark"
      topLabel="Benchmark"
      onSelection={onChange}
      selectedValue={benchmark}
      options={toPairs(CONFIG.views[platform].benchmarks)
        .sort('benchmarkKey')
        .select({ value: 'benchmarkKey', label: 'label' })
        .append({ value: 'overview', label: 'Overview' })
        .toArray()}
    />
  </div>
);

Pickers.propTypes = {
  classes: PropTypes.shape().isRequired,
  benchmark: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  platform: PropTypes.string.isRequired,
};

export default withStyles(styles)(Pickers);
