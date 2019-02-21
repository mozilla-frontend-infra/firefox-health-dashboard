// eslint-disable react/prop-types
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import isEqual from 'lodash/isEqual';
import { frum, zipObject } from '../../queryOps';
import { URL2Object, Object2URL } from '../../convert';
import Picker from './picker';

function withNavigation(config) {
  // https://reactjs.org/docs/higher-order-components.html
  //
  // Deals with synchronizing url paramters with this.state, and
  // selector widget states
  //
  // Expects a `config` that is a list of configurations for various
  // selection widgets. Right now there is only Picker.
  //
  // Adds a `navigation` property to `props` that contains a Navigation
  // component for component to include on `render()`

  // withRouter() allow us to use this.props.history to push a new address

  return WrappedComponent => {
    class Output extends React.Component {
      constructor(props) {
        super(props);
        const { location } = props;
        const params = URL2Object(location.search);

        this.params = params;

        // SET PARAMETERS TO DEFAULT VALUES, OR URL PARAMETER
        this.state = frum(config)
          .map(({ id, defaultValue }) => [params[id] || defaultValue, id])
          .args()
          .fromPairs();

        this.updateHistory({});
      }

      onPathChange(event) {
        const { name, value } = event.target;
        const change = zipObject([name], [value]);

        this.setState(change);

        this.updateHistory(change);
      }

      updateHistory(change) {
        const { history, location } = this.props;
        const newState = { ...this.state, ...change };
        const oldState = URL2Object(location.search);

        if (isEqual(newState, oldState)) return;

        const query = Object2URL(newState);

        history.push(`${location.pathname}?${query}`);
      }

      navComponents() {
        const { classes } = this.props;
        const params = this.state;
        const self = this;

        return (
          <div className={classes.root}>
            {config.map(c => {
              const { id, label, options } = c;

              return (
                <Picker
                  key={id}
                  id={id}
                  label={label}
                  handleChange={(...args) => self.onPathChange(...args)}
                  value={params[id]}
                  options={options}
                />
              );
            })}
          </div>
        );
      }

      render() {
        const { history, classes, ...props } = this.props;

        return (
          <WrappedComponent
            navigation={this.navComponents()}
            {...props}
            {...this.state}
          />
        );
      }
    }

    Output.propTypes = {
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

    const styles = () => ({
      root: {
        display: 'flex',
        textAlign: 'left',
        padding: '15px',
      },
    });

    return withRouter(withStyles(styles)(Output));
  };
}

export { withNavigation }; // eslint-disable-line import/prefer-default-export
