const TELEMETRY_CONFIG = {
  winOpen: {
    channel: 'nightly',
    metric: 'FX_NEW_WINDOW_MS',
    useSubmissionDate: false,
    evoVersions: '5',
    filters: {
      application: 'Firefox',
    },
  },
  tabSwitch: {
    channel: 'nightly',
    metric: 'FX_TAB_SWITCH_TOTAL_E10S_MS',
    evoVersions: '5',
    filters: {
      application: 'Firefox',
    },
  },
  tabClose: {
    channel: 'nightly',
    metric: 'FX_TAB_CLOSE_TIME_ANIM_MS',
    evoVersions: '5',
    filters: {
      application: 'Firefox',
    },
  },
  firstPaint: {
    channel: 'nightly',
    metric: 'SIMPLE_MEASURES_FIRSTPAINT',
    evoVersions: '5',
    filters: {
      child: 'parent',
      application: 'Firefox',
    },
  },
};
export default TELEMETRY_CONFIG;
