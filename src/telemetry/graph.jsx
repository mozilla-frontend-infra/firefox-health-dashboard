/* eslint-disable jsx-a11y/anchor-is-valid */
/* global fetch */
import MG from 'metrics-graphics';
import PropTypes from 'prop-types';
import React from 'react';
import { stringify } from 'query-string';
import { withStyles } from '@material-ui/core/styles';
import SETTINGS from '../settings';
import { DefaultErrorMessage } from '../components/criticalErrorMessage';

const styles = {
  errorPanel: {
    margin: '40px auto',
    width: '50%',
  },
};

class TelemetryContainer extends React.Component {
  state = {
    showErrorMsg: false,
  };

  async componentDidMount() {
    this.fetchPlotGraph(this.props.id, this.props.queryParams);
  }

  async fetchPlotGraph(id, queryParams) {
    let url = `${SETTINGS.backend}/api/perf/telemetry?`;

    url += stringify({
      name: id,
      ...queryParams,
    });

    try {
      const { graphData, telemetryUrl } = await (await fetch(url)).json();

      if (!this.graphTitleLink) {
        return;
      }

      const fullTelemetryUrl = `${telemetryUrl}&processType=parent`;

      this.graphTitleLink.setAttribute('href', fullTelemetryUrl);
      this.graphSubtitleEl.textContent = graphData.description;
      this.graphEvolutionsTimeline(graphData, this.graphEl);
    } catch (error) {
      this.setState({ showErrorMsg: true });
      // eslint-disable-next-line no-console
      console.error(error.message);
    }
  }

  graphEvolutionsTimeline({ datas, params, yLabel, legendLabels }, graphEl) {
    const newDatas = datas.map(evo => MG.convert.date(evo, 'date'));

    MG.data_graphic({
      data: newDatas,
      chart_type: 'line',
      full_width: true,
      full_height: true,
      top: 0,
      right: 0,
      bottom: 40,
      left: 80,
      min_y_from_data: true,
      target: graphEl,
      x_extended_ticks: true,
      x_label: params.useSubmissionDate ? 'Submission Date' : 'Built Date',
      y_label: yLabel,
      xax_format: date => `${date.getMonth() + 1}-${date.getDate()}`,
      yax_format: y => y,
      transition_on_update: false,
      legend: legendLabels,
      legend_target: graphEl.querySelector('.graph-legend'),
      aggregate_rollover: true,
      show_secondary_x_label: false,
    });
  }

  render() {
    const { id, title, classes } = this.props;
    const { showErrorMsg } = this.state;

    if (title) {
      return (
        <div id={id} key={id} className="criteria-widget">
          <header>
            <h3 className="graph-title">
              <a
                className="graph-title-link"
                ref={a => (this.graphTitleLink = a)}>
                {title}
              </a>
            </h3>
          </header>
          {showErrorMsg ? (
            <DefaultErrorMessage style={classes.errorPanel} />
          ) : (
            <div>
              <div
                className="graph-subtitle"
                ref={div => (this.graphSubtitleEl = div)}>
                {}
              </div>
              <div className="graph" ref={div => (this.graphEl = div)}>
                <div className="graph-legend">{}</div>
              </div>
            </div>
          )}
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

export default withStyles(styles)(TelemetryContainer);
