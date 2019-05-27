import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge/Badge';
import generateBugzillaUrls from '../../utils/bugzilla/generateBugzillaUrls';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    margin: '0 0 1rem 0',
  },
};
const BugzillaUrl = ({ bugCount, text, url }) => (
  <a href={url} target="_blank" rel="noopener noreferrer">
    {!bugCount && text}
    {bugCount && (
      <Badge color="primary" badgeContent={bugCount}>
        {text}
      </Badge>
    )}
  </a>
);

BugzillaUrl.propTypes = {
  bugCount: PropTypes.number,
  classes: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

class BugzillaUrlContainer extends Component {
  state = {
    urls: null,
  };

  async componentDidMount() {
    await this.generateUrls(this.props);
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
  queries: PropTypes.arrayOf(
    PropTypes.shape({
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
    })
  ),
};

export default withStyles(styles)(BugzillaUrlContainer);
