import Raven from 'raven-js';
import { Component } from 'react';
import PropTypes from 'prop-types';

import CriticalErrorMessage from '../components/criticalErrorMessage';

const reportOrLog = (error, info) => {
    if (process.env.NODE_ENV === 'production') {
        Raven.captureException(error);
    } else {
        console.error(error);
    }
    if (info) {
        if (process.env.NODE_ENV === 'production') {
            Raven.captureMessage(info);
        } else {
            console.info(info);
        }
    }
};

const withErrorBoundary = (WrappedComponent) => {
    const ErrorBoundary = class extends Component {
        constructor(props) {
            super(props);
            this.handleError = this.handleError.bind(this);
        }

        state = {
            errorMessage: false,
            caughtBoundaryError: false,
        }

        componentDidCatch(error, info) {
            this.setState({ caughtBoundaryError: true });
            reportOrLog(error, info);
        }

        handleError(error, info) {
            if (error.message === 'Failed to fetch') {
                this.setState({ errorMessage: true });
                reportOrLog(error, info);
            } else {
                this.setState({ errorMessage: true });
                throw error;
            }
        }

        render() {
            if (this.state.errorMessage) {
                return <CriticalErrorMessage />;
            }
            if (this.state.caughtBoundaryError) {
                if (this.props.critical) {
                    return <CriticalErrorMessage />;
                }
                return (
                  <div>
                    <p style={{ color: 'black' }}>Oops; something went wrong</p>
                  </div>
                );
            }
            return <WrappedComponent handleError={this.handleError} {...this.props} />;
        }
    };
    ErrorBoundary.propTypes = {
        critical: PropTypes.bool,
    };
    ErrorBoundary.defaultProps = {
        critical: false,
    };
    return ErrorBoundary;
};

export default withErrorBoundary;
