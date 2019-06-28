import { curveLinear } from 'd3';
import React, { Component } from 'react';
import propTypes from 'prop-types';
import MetricsGraphics from 'react-metrics-graphics';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import getData from '../utils/perfherder/subbenchmarks';
import { withErrorBoundary } from '../vendor/errors';
import { toPairs } from '../vendor/vectors';

const DEFAULT_PERCENTILE_THRESHOULD = 99;
const Subbenchmarks = ({ match }) => (
  <div>
    <PerfherderContainer {...match.params} />
  </div>
);

Subbenchmarks.propTypes = {
  match: propTypes.shape({}).isRequired,
};

const Graph = ({ data, name, url }) => (
  <div key={name}>
    <div className="black-bar">
      <span>{name}</span>
      <a
        className="header-item"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        alt="View all subtests on Perfherder">
        <FontAwesomeIcon
          icon={faExternalLinkAlt}
          style={{ marginLeft: '0.3em' }}
        />
      </a>
    </div>
    <MetricsGraphics
      key={name}
      data={data}
      {...{
        x_accessor: 'datetime',
        y_accessor: 'value',
        min_y_from_data: true,
        full_width: true,
        area: false,
        interpolate: curveLinear,
      }}
    />
  </div>
);

Graph.propTypes = {
  data: propTypes.array.isRequired,
  name: propTypes.string.isRequired,
  url: propTypes.string.isRequired,
};

class PerfherderContainerPre extends Component {
  state = {
    data: undefined,
  };

  async componentDidMount() {
    await this.data(this.props);
  }

  async componentDidUpdate(prevProps) {
    // The component has been called with new props and we
    // need to update the state or the old state will be used
    if (this.props.suite !== prevProps.suite) {
      this.data(this.props);
    }
  }

  async data(
    { platform, suite, framework, repo = 'mozilla-central', option },
    percentileThreshold = DEFAULT_PERCENTILE_THRESHOULD
  ) {
    const { perfherderUrl, data, parentSignature } = await getData({
      suite,
      platform,
      framework: Number.parseInt(framework, 10),
      repo,
      option,
      percentileThreshold,
    });

    this.setState({ perfherderUrl, data, parentSignature });
  }

  render() {
    const { perfherderUrl, data, parentSignature } = this.state;
    let parent;

    if (parentSignature && parentSignature in data) {
      parent = data[parentSignature];
      delete data[parentSignature];
    }

    return (
      <div className="subbenchmarks align-center">
        {(() => {
          if (!data) {
            return (
              <div>
                <h3>Loading...</h3>
              </div>
            );
          }

          return (
            <div>
              <div className="header">
                <h2 className="wider-letter-spacing">{this.props.suite}</h2>
                <a
                  className="header-item"
                  href={perfherderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  alt="View all subtests on Perfherder">
                  <FontAwesomeIcon
                    icon={faExternalLinkAlt}
                    style={{ marginLeft: '0.3em' }}
                  />
                </a>
              </div>
              {parent && (
                <Graph
                  key={parent.meta.test}
                  data={[parent.data]}
                  name={parent.meta.test}
                  url={parent.meta.url}
                />
              )}
              {toPairs(data)
                .sort('meta.test')
                .map(el => (
                  <Graph
                    key={el.meta.test}
                    data={[el.data]}
                    name={el.meta.test}
                    url={el.meta.url}
                  />
                ))}
            </div>
          );
        })()}
      </div>
    );
  }
}

PerfherderContainerPre.propTypes = {
  framework: propTypes.string.isRequired,
  platform: propTypes.string.isRequired,
  suite: propTypes.string.isRequired,
  percentileThreshold: propTypes.number,
};

const PerfherderContainer = withErrorBoundary(PerfherderContainerPre);

export default Subbenchmarks;
