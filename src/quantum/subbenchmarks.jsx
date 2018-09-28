import { curveLinear } from 'd3';
import { Component } from 'react';
import propTypes from 'prop-types';
import MetricsGraphics from 'react-metrics-graphics';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faLink from '@fortawesome/fontawesome-free-solid/faLink';
import faExternalLinkAlt from '@fortawesome/fontawesome-free-solid/faExternalLinkAlt';

import getData from '../utils/perfherder/subbenchmarks';

const DEFAULT_PERCENTILE_THRESHOULD = 99;

const Subbenchmarks = ({ match }) => (
  <div>
    <PerfherderContainer
      suite={match.params.suite}
      platform={match.params.platform}
    />
  </div>
);

Subbenchmarks.propTypes = {
  match: propTypes.shape({}).isRequired,
};

const Graph = ({ data, name, url }) => (
  <div key={name}>
    <div className='black-bar'>
      <a href={`#${name}`}>
        <FontAwesomeIcon
          id={name}
          icon={faLink}
          style={{ marginRight: '0.3em' }}
        />
      </a>
      <a href={url} target='_blank'>{name}</a>
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

class PerfherderContainer extends Component {
  state = {
    data: undefined,
  };

  async componentDidMount() {
    this.data(this.props);
  }

  async componentDidUpdate(prevProps) {
    // The component has been called with new props and we
    // need to update the state or the old state will be used
    if (this.props.suite !== prevProps.suite) {
      this.data(this.props);
    }
  }

  async data({ platform, suite }, percentileThreshold = DEFAULT_PERCENTILE_THRESHOULD) {
    const { perfherderUrl, data, parentSignature } = await
      getData({ suite, platform, percentileThreshold });
    this.setState({ perfherderUrl, data, parentSignature });
  }

  render() {
    const { perfherderUrl, data, parentSignature } = this.state;

    const sortAlphabetically = (a, b) => {
      if (a.meta.test < b.meta.test) return -1;
      if (a.meta.test > b.meta.test) return 1;
      return 0;
    };

    let parent;
    if (parentSignature && parentSignature in data) {
      parent = data[parentSignature];
      delete data[parentSignature];
    }

    return (
      <div className='subbenchmarks align-center'>
        {!data
          ? (
            <div>
              <h3>Loading...</h3>
            </div>
)
          : (
            <div>
              <div className='header'>
                <h2 className='wider-letter-spacing'>
                  {this.props.suite}
                </h2>
                <a
                  className='header-item'
                  href={perfherderUrl}
                  target='_blank'
                  alt='View all subtests on Perfherder'
                >
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
              {Object.values(data).sort(sortAlphabetically).map(el => (
                <Graph
                  key={el.meta.test}
                  data={[el.data]}
                  name={el.meta.test}
                  url={el.meta.url}
                />
            ))}
            </div>
)
        }
      </div>
    );
  }
}

PerfherderContainer.propTypes = {
  platform: propTypes.string.isRequired,
  suite: propTypes.string.isRequired,
  percentileThreshold: propTypes.number,
};

export default Subbenchmarks;
