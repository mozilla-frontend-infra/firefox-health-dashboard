import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import BugzillaUrl from '../../components/BugzillaUrl';
import generateBugzillaUrls from '../../utils/bugzilla/generateBugzillaUrls';

const styles = {
    root: {
        display: 'flex',
        flexDirection: 'column',
        margin: '0 0 1rem 0',
    },
};

class BugzillaUrlContainer extends Component {
    state = {
        urls: null,
    };

    async componentDidMount() {
        this.generateUrls(this.props);
    }

    async generateUrls({ includeBugCount, queries }) {
        const urls = await generateBugzillaUrls(queries, includeBugCount);
        this.setState({ urls });
    }

    render() {
        const { urls } = this.state;
        const { classes } = this.props;

        if (!urls) {
            return null;
        }
        return (
          <div className={classes.root}>
            {urls.map(({ bugCount, text, url }) => (
              <BugzillaUrl key={url} bugCount={bugCount} text={text} url={url} />
            ))}
          </div>
        );
    }
}

BugzillaUrlContainer.propTypes = {
    classes: PropTypes.shape({}).isRequired,
    includeBugCount: PropTypes.bool,
    queries: PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.string.isRequired,
        parameters: PropTypes.shape({
            include_fields: PropTypes.string,
            component: PropTypes.string,
            resolution: PropTypes.oneOfType([
                PropTypes.arrayOf(PropTypes.string),
                PropTypes.string,
            ]),
            priority: PropTypes.arrayOf(PropTypes.string),
        }),
    })),
};

export default withStyles(styles)(BugzillaUrlContainer);
