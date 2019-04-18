const CONFIG = {
  packageIdLabels: {
    'org.mozilla.klar': 'Firefox Klar',
    'com.chrome.beta': 'Chrome Beta',
    'org.mozilla.geckoview_example': 'GeckoView Example',
    'org.mozilla.reference.browser': 'Reference Browser',
    'org.mozilla.fenix': 'Firefox Preview',
  },
  products: [
    'org.mozilla.klar',
    'com.chrome.beta',
    'org.mozilla.geckoview_example',
    'org.mozilla.reference.browser',
    'org.mozilla.fenix',
  ],
  summaryTable: [
    'org.mozilla.klar',
    'org.mozilla.geckoview_example',
    'com.chrome.beta',
  ],
  baseProduct: 'org.mozilla.geckoview_example',
  compareProduct: 'com.chrome.beta',
  targetRatio: 1.2,
};

export default CONFIG;
