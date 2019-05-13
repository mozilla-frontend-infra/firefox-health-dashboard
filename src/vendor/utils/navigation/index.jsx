// eslint-disable react/prop-types
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { isEqual } from '../../Data';
import { selectFrom } from '../../vectors';
import { missing } from '../../utils';
import { fromQueryString, URL } from '../../requests';

function withNavigation(config) {
  // https://reactjs.org/docs/higher-order-components.html
  //
  // Deals with synchronizing url parameters with this.state, and
  // selector widget states, and url history
  //
  // Expects a `config` that is a list of configurations for various
  // selection widgets. Right now there is only Picker.
  //
  // Adds properties to `props`:
  // * `navigation` - that contains a Navigation component
  //   to include on `render()`
  // * properties with names selectFrom(config).select("id")

  return WrappedComponent => {
    class Output extends React.Component {
      constructor(props) {
        super(props);
        const { location } = props;
        const params = fromQueryString(location.search);

        // SET PARAMETERS TO DEFAULT VALUES, OR URL PARAMETER
        this.state = selectFrom(config)
          .map(({ id, defaultValue, options }) => {
            const selected = params[id];

            if (missing(selected)) {
              return [defaultValue, id];
            }

            if (
              selectFrom(options)
                .select('id')
                .includes(selected)
            ) {
              return [selected, id];
            }

            return [defaultValue, id];
          })
          .args()
          .fromPairs();

        this.updateHistory({});
      }

      onPathChange = event => {
        const { name, value } = event.target;
        const change = { [name]: value };

        this.setState(change);

        this.updateHistory(change);
      };

      componentDidUpdate(prevProps) {
        const { search: thisSearch } = this.props.location;
        const { search: prevSearch } = prevProps.location;

        if (thisSearch !== prevSearch) {
          // Update state based on current props
          // eslint-disable-next-line react/no-did-update-set-state
          this.setState(state => ({
            ...state,
            ...fromQueryString(thisSearch),
          }));
        }
      }

      updateHistory(change) {
        const { history, location } = this.props;
        const newState = { ...this.state, ...change };
        const oldState = fromQueryString(location.search);

        if (isEqual(newState, oldState)) {
          return;
        }

        history.push(URL({ path: location.pathname, query: newState }));
      }

      navComponents() {
        const { classes } = this.props;
        const params = this.state;

        return (
          <div className={classes.root}>
            {config.map(c => {
              const { type, id, label, options } = c;

              return React.createElement(type, {
                key: id,
                id,
                label,
                handleChange: this.onPathChange,
                value: params[id],
                options,
              });
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
          type: PropTypes.instanceOf(React.Component).isRequired,
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
        padding: '1rem',
      },
    });

    // withRouter() adds this.props.history
    return withRouter(withStyles(styles)(Output));
  };
}

export { withNavigation }; // eslint-disable-line import/prefer-default-export
