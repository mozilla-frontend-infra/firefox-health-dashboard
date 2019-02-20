// eslint-disable react/prop-types
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { frum, toPairs, zipObject } from '../../queryOps';
import Picker from './picker';

const styles = () => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    padding: '15px',
  },
});

class Navigation extends Component {
  constructor(props) {
    super(props);
    const { config, location } = props;
    const params = new URLSearchParams(location.search);

    // SET PARAMETERS TO DEFAULT VALUES, OR URL PARAMETER
    this.state = frum(config)
      .map(({ id, defaultValue }) => [params[id] || defaultValue, id])
      .args()
      .fromPairs();

    this.updateHistory();
  }

  onPathChange = event => {
    const { name, value } = event.target;

    this.setState(zipObject([name], [value]));
    this.updateHistory();
  };

  updateHistory() {
    const { history, location } = this.props;
    const query = toPairs(this.getState())
      .map((v, k) => `${k}=${encodeURIComponent(v)}`)
      .concatenate('&');
    const path = location;

    history.push(`${path}?${query}`);
  }

  render() {
    const params = this.getState();

    return frum(this.props.config).map(config => {
      const { id, label, options } = config;

      return (
        <Picker
          key={id}
          identifier={id}
          topLabel={label}
          handleChange={this.onPathChange}
          selectedValue={params[id]}
          options={options}
        />
      );
    });
  }
}

Navigation.propTypes = {
  classes: PropTypes.shape().isRequired,
  config: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.string,
      defaultValue: PropTypes.string,
      onChange: PropTypes.func.isRequired,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
        })
      ),
    })
  ),
};

function withNavigation(config) {
  // Deals with synchronizing url paramters with this.state, and
  // selector widget states
  //
  // Expects a `config` that is a list of configurations for various
  // selection widgets. Right now there is only Picker.
  //
  // Adds a `navigation` property to `props` that contains a Navigation
  // component for component to include on `render()`

  // withRouter() allow us to use this.props.history to push a new address
  const nav = withRouter(withStyles(styles)(Navigation))({ ...config });

  return component => {
    class Output extends component {
      constructor({ ...args }) {
        super({ navigation: nav, ...args });
      }
    }

    return Output;
  };
}

export { withNavigation }; // eslint-disable-line import/prefer-default-export
