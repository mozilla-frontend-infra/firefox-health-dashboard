/* eslint-disable react/no-multi-comp */
import React from 'react';
import AnnotationIconInternal from '@material-ui/icons/Announcement';
import PropTypes from 'prop-types';
import { selectFrom } from '../../vectors';
import { Signal, sleep } from '../../signals';

const AnnotationIcon = () => (
  <div style={{
    left: 0, top: 0, margin: 0, border: 0, transform: 'translate(0, -100%)',
  }}
  >
    <AnnotationIconInternal />
  </div>
);

class Notes extends React.Component {
  constructor(props) {
    /*
    EXPECT LIST OF {x, y} PAIRS WITH NOTE POSITIONS
     */
    super(props);
    this.state = { current: null };
    this.pleaseStop = new Signal();

    (
      async () => {
        let curr = null;
        let area = {};
        while (!this.pleaseStop.valueOf()) {
          const { chartRef: { current } } = this.props;
          if (current) {
            const { chartArea } = current.chartInstance;
            if (curr !== current || chartArea !== area) {
              curr = current;
              area = chartArea;
              this.setState({ current });
              this.forceUpdate();
            }
          }
          // eslint-disable-next-line no-await-in-loop
          await sleep(1);
        }
      }
    )();
  }

  componentWillUnmount() {
    this.pleaseStop.go();
  }

  render() {
    const { notes } = this.props;
    const { current } = this.state;
    if (!current || !notes) return null;

    const { scales } = current.chartInstance;
    const xScale = scales['x-axis-0'];
    const yScale = scales['y-axis-0'];

    return selectFrom(notes)
      .map(({ x, y, id }) => (
        <div
          key={id}
          style={{
            position: 'absolute',
            top: yScale.getPixelForValue(y),
            left: xScale.getPixelForValue(x),
          }}
        >
          <AnnotationIcon />
        </div>
      )).toArray();
  }
}

Notes.propTypes = {
  notes: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      note: PropTypes.string,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    }),
  ),
  chartRef: PropTypes.instanceOf(Object),
};

export { Notes }; // eslint-disable-line import/prefer-default-export
