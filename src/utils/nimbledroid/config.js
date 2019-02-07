const CONFIG = {
  packageIdLabels: {
    'org.mozilla.klar': 'Firefox Klar',
    'org.mozilla.geckoview_example': 'GeckoView Example',
    // 'org.mozilla.focus': 'WebView',
    'com.chrome.beta': 'Chrome Beta',
  },
  products: [
    'org.mozilla.klar',
    'org.mozilla.geckoview_example',
    'com.chrome.beta',
  ],
  baseProduct: 'org.mozilla.geckoview_example',
  compareProduct: 'com.chrome.beta',
  targetRatio: 1.2,
};

export default CONFIG;
