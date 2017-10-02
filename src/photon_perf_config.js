const PHOTON_CONFIG = [
  {
    name: 'winOpen',
    plot: {
      channel: 'nightly',
      version: '',
      metric: 'FX_NEW_WINDOW_MS',
      useSubmissionDate: false,
      sanitize: true,
      trim: true,
      compare: '',
      sensibleCompare: true,
      evoVersions: '3',
      filters: {
        application: 'Firefox',
      },
    },
  }, {
    name: 'tabSwitch',
    plot: {
      channel: 'nightly',
      version: '',
      metric: 'FX_TAB_SWITCH_TOTAL_E10S_MS',
      useSubmissionDate: false,
      sanitize: true,
      trim: true,
      compare: '',
      sensibleCompare: true,
      evoVersions: '3',
      filters: {
        application: 'Firefox',
      },
    },
  }, {
    name: 'tabClose',
    plot: {
      channel: 'nightly',
      version: '',
      metric: 'FX_TAB_CLOSE_TIME_ANIM_MS',
      useSubmissionDate: false,
      sanitize: true,
      trim: true,
      compare: '',
      sensibleCompare: true,
      evoVersions: '3',
      filters: {
        application: 'Firefox',
      },
    },
  }, {
    name: 'firstPaint',
    plot: {
      channel: 'nightly',
      version: '',
      metric: 'SIMPLE_MEASURES_FIRSTPAINT',
      useSubmissionDate: false,
      sanitize: true,
      trim: true,
      compare: '',
      sensibleCompare: true,
      evoVersions: '3',
      filters: {
        application: 'Firefox',
      },
    },
  },
];
export default PHOTON_CONFIG;
