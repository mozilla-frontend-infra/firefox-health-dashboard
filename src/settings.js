const SETTINGS = {
  backend:
    process.env.BACKEND || 'https://firefox-health-backend.herokuapp.com',
  // This is less than ideal but it helps for now
  colors: ['#e55525', '#ffcd02', '#45a1ff', '#77cc00', '#fd79ff'],
  firefoxReleases:
    'https://product-details.mozilla.org/1.0/firefox_history_major_releases.json',
};

export default SETTINGS;
