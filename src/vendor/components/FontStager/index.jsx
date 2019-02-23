import React, { Component } from 'react';
import FoutStager from 'react-fout-stager';
import './index.css';

export default class FontStager extends Component {
  render() {
    return (
      <FoutStager
        stages={[
          {
            className: 'font-stage-primary',
            families: [{ family: 'Roboto400' }],
            stages: [
              {
                className: 'font-stage-secondary',
                families: [
                  { family: 'Roboto300', options: { weight: 300 } },
                  { family: 'Roboto500', options: { weight: 500 } },
                ],
              },
            ],
          },
        ]}
      />
    );
  }
}
