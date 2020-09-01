import { TP6_SITES_DATA, TP6_TESTS_DATA } from '../windows/config';
import { selectFrom } from '../vendor/vectors';
import { Data } from '../vendor/datas';

const PLATFORMS = [
  {
    id: 'win64-qr',
    label: 'win64-qr',
    filter: {
      eq: {
        platform: 'windows10-64-shippable-qr',
        // options: 'pgo',
      },
    },
  },
  {
    id: 'linux64-qr',
    label: 'linux64-qr',
    filter: {
      eq: {
        platform: 'linux64-shippable-qr',
        // options: 'pgo',
      },
    },
  },
];

const PERFORMANCE_COMBO_TABLE = {
  header: ['id', 'label', 'suite'],
  data: [
    ['page-load-(tp5)', 'Page load (tp5)', 'tp5o'],
    ['window-opening-(tpaint-e10s)', 'Window Opening (tpaint e10s)', 'tpaint'],
    ['start-up-(sessionrestore)', 'Start-up (sessionrestore)', 'sessionrestore'],
    ['start-up-(sessionrestore_no_auto_restore)', 'Start-up (sessionrestore_no_auto_restore)', 'sessionrestore_no_auto_restore'],
    ['start-up-(ts_paint)', 'Start-up (ts_paint)', 'ts_paint'],
    ['start-up-(sessionrestore_many_windows)', 'Start-up (sessionrestore_many_windows)', 'sessionrestore_many_windows'],
    ['start-up-(about_home_paint)', 'Start-up (about_home_paint)', 'startup_about_home_paint'],
    ['start-up-(about_home_paint_realworld_webextensions)', 'start-up-(about_home_paint_realworld_webextensions)', 'startup_about_home_paint_realworld_webextensions'],
    ['tab-opening-(tabpaint)', 'Tab Opening (tabpaint)', 'tabpaint'],
    ['tab-animation-(tart)', 'Tab Animation (TART)', 'tart'],
    ['tab-switch-(tabswitch)', 'Tab Switch (tabswitch)', ['tps', 'tabswitch']],
    ['svg-(tsvg_static)', 'SVG (tsvg_static)', 'tsvg_static'],
    ['svg-(tsvgr_opacity)', 'SVG (tsvgr_opacity)', 'tsvgr_opacity'],
    ['svg-(tsvgx)', 'SVG (tsvgx)', 'tsvgx'],
  ],
};


const TP6_FISSION_COMBOS = selectFrom(TP6_SITES_DATA.data)
  .map(row => Data.zip(TP6_SITES_DATA.header, row))
  .where({ browser: 'Firefox' })
  .sort('site')
  .leftJoin('mode', TP6_TESTS_DATA, 'mode')
  .map(({
    siteFilter, testFilter, ...rest
  }) => ({
    ...rest,
    filter: { and: [siteFilter, testFilter] },
  }))
  .materialize();

const PERFORMANCE_COMBOS = PERFORMANCE_COMBO_TABLE.data.map(row => Data.zip(PERFORMANCE_COMBO_TABLE.header, row));

export { PLATFORMS, TP6_FISSION_COMBOS, PERFORMANCE_COMBOS };
