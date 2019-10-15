/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component, lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import SETTINGS from '../settings';
import { Log } from '../vendor/logs';
import { fetchJson, URL } from '../vendor/requests';
import { withErrorBoundary } from '../vendor/errors';

const MetricsGraphics = lazy(() => import(/* webpackChunkName: "react-metrics-graphics" */ 'react-metrics-graphics'));

class TelemetryContainer extends Component {
  state = {
    graphData: null,
    telemetryUrl: null,
  };

  get fullTelemetryUrl() {
    const { telemetryUrl } = this.state;
    if (telemetryUrl) {
      return URL({
        path: telemetryUrl,
        query: { processType: 'parent' },
      });
    }

    return null;
  }

  async componentDidMount() {
    await this.fetchPlotGraph();
  }

  async fetchPlotGraph() {
    const { id, queryParams } = this.props;
    const url = URL({
      path: [SETTINGS.backend, 'api/perf/telemetry'],
      query: {
        name: id,
        ...queryParams,
      },
    });

    try {
      const { graphData, telemetryUrl } = await fetchJson(url);
      this.setState({
        graphData,
        telemetryUrl,
      });
    } catch (cause) {
      throw Log.error('Problem loading {{url}}', { url }, cause);
    }
  }

  renderGraph() {
    const {
      graphData: {
        datas, params, yLabel, legendLabels,
      },
    } = this.state;

    return (
      <Suspense fallback="">
        <MetricsGraphics
          aggregate_rollover
          bottom={40}
          chart_type="line"
          data={datas}
          full_height
          full_width
          left={80}
          legend={legendLabels}
          legend_target={this.legendTarget}
          min_y_from_data
          right={0}
          show_secondary_x_label={false}
          top={0}
          transition_on_update={false}
          xax_format={date => `${date.getMonth() + 1}-${date.getDate()}`}
          x_extended_ticks
          x_label={params.useSubmissionDate ? 'Submission Date' : 'Built Date'}
          yax_format={y => y}
          y_label={yLabel}
        />
      </Suspense>
    );
  }

  render() {
    const { id, title } = this.props;
    const { graphData } = this.state;


    if (title) {
      return (
        <div id={id} key={id} className="criteria-widget">
          <header>
            <h3 className="graph-title">
              {
                this.fullTelemetryUrl && (
                  <a className="graph-title-link" href={this.fullTelemetryUrl}>
                    {title}
                  </a>
                )
              }
            </h3>
          </header>
          <div>
            <div className="graph-subtitle">
              {graphData.description}
            </div>

            {graphData && this.renderGraph()}
          </div>
        </div>
      );
    }
  }
}

TelemetryContainer.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  queryParams: PropTypes.shape({}),
};

export default withErrorBoundary(TelemetryContainer);
