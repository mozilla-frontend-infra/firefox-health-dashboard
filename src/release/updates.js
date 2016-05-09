import moment from 'moment';
import fetchHtml from '../fetch/html';
import channels from './channels';
import getVersions from './versions';

export async function getUpdate(channel = 'release') {
  const versions = await getVersions();
  const latest = versions[channel] || versions.aurora;
  // https://aus5.mozilla.org/update/3/%PRODUCT%/%VERSION%/%BUILD_ID%/%BUILD_TARGET%/%LOCALE%/%CHANNEL%/%OS_VERSION%/%DISTRIBUTION%/%DISTRIBUTION_VERSION%/update.xml
  const url = `https://aus5.mozilla.org/update/3/Firefox/${latest}/0/Darwin_x86_64-gcc3-u-i386-x86_64/en-US/${channel}/Darwin%2015.4.0/default/default/update.xml?force=1`;
  const $ = await fetchHtml(url);
  const field = $('update');
  const date = moment(field.prop('buildid'), 'YYYYMMDDHHmmss');
  return {
    version: field.prop('appversion'),
    build_id: field.prop('buildid'),
    date: date.format('YYYY-MM-DD')
  };
}

export async function getUpdates() {
  const result = {};
  for (let channel of channels) {
    result[channel] = getUpdate(channel);
  }
  return result;
}
