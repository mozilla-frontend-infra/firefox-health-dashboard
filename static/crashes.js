/* global fetch */

import 'babel-polyfill';
import React from 'react';
import MG from 'metrics-graphics';

export default class Crashes extends React.Component {
  state = {
    crashes: []
  };

  async renderFirefoxTelemetryCrashes() {
    const crashes = await (await fetch('/api/crashes')).json();
    const data = MG.convert.date(crashes, 'date');
    const releases = await (await fetch('/api/release/history')).json();
    const markers = releases.map((entry) => {
      return {
        date: new Date(entry.date),
        label: entry.version
      };
    });
    MG.data_graphic({
      title: 'Firefox Telemetry Crash Rate',
      data: data,
      width: 1000,
      height: 300,
      target: '#firefox-telemetry-crashes',
      x_accessor: 'date',
      y_accessor: 'combined_crash_rate',
      markers: markers,
      min_y: 3,
      max_y: 4.5,
      show_secondary_x_label: false
    });
  }

  async renderFirefoxCrashes() {
    const crashes = await (await fetch('/api/crashes/adi')).json();
    const data = MG.convert.date(crashes, 'date');
    const releases = await (await fetch('/api/release/history')).json();
    const markers = releases.map((entry) => {
      return {
        date: new Date(entry.date),
        label: entry.version
      };
    });
    markers.push({
      date: new Date('2016-01-17'),
      label: 'Baseline'
    });
    const baselines = [
      { value: 1.08, label: '1.08' },
      { value: 0.75, label: '0.75' }
    ];
    MG.data_graphic({
      title: 'Firefox ADI Crash Rate',
      data: data,
      width: 1000,
      height: 300,
      target: '#firefox-crashes',
      x_accessor: 'date',
      y_accessor: 'combined_crash_rate',
      markers: markers,
      min_y: 0.7,
      max_y: 1.5,
      baselines: baselines,
      show_secondary_x_label: false
    });
  }

  async renderFennecCrashes() {
    const crashes = await (await fetch('/api/crashes/adi?product=fennec')).json();
    const data = MG.convert.date(crashes, 'date');
    const markers = [];
    markers.push({
      date: new Date('2016-01-17'),
      label: 'Baseline'
    });
    const baselines = [
      { value: 1.91, label: '1.91' },
      { value: 1.26, label: '1.26' }
    ];
    MG.data_graphic({
      title: 'Fennec ADI Crash Rate',
      data: data,
      width: 1000,
      height: 300,
      target: '#fennec-crashes',
      x_accessor: 'date',
      y_accessor: 'combined_crash_rate',
      markers: markers,
      min_y: 1,
      max_y: 2,
      baselines: baselines,
      show_secondary_x_label: false
    });
  }

  async componentDidMount() {
    await this.renderFirefoxCrashes();
    await this.renderFennecCrashes();
    await this.renderFirefoxTelemetryCrashes();
  }

  render() {
    return (
      <div>
        <div id='firefox-crashes'></div>
        <div id='firefox-telemetry-crashes'></div>
        <div id='fennec-crashes'></div>
      </div>
    );
  }

  // Needs fixes for including CSS
  // https://spin.atomicobject.com/2014/01/21/convert-svg-to-png/
  download({currentTarget}) {
    const svg = currentTarget.querySelector('svg');
    const xml = new window.XMLSerializer().serializeToString(svg);
    const data = `data:image/svg+xml;base64,${window.btoa(xml)}`;
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'graph.png';
        document.body.appendChild(a);
        a.click();
        a.parentNode.removeChild(a);
      }, 'image/png');
    };
    img.src = data;
  }
}
