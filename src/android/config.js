/* eslint-disable */

import React from "react";
import { withStyles } from "@material-ui/core";
import { selectFrom } from "../vendor/vectors";
import { GMTDate as Date } from "../vendor/dates";
import { round } from "../vendor/math";
import { HelpIcon } from "../utils/icons";
import { Data } from "../vendor/datas";
import { MOZILLA_CENTRAL } from "../utils/PerfherderGraphContainer";

const SHOW_TELEMETRY = false;
const TARGET_NAME = "Firefox ESR";
const REFERENCE_BROWSER = ["fennec68"];
const REFERENCE_COLOR = "#45a1ff44";
const GEOMEAN_DESCRIPTION = {
  title: "more information",
  url:
    "https://github.com/mozilla-frontend-infra/firefox-health-dashboard/blob/master/docs/about-pageload.md#about---site-load-times",
  icon: HelpIcon
};

const tipStyles = {
  below: {
    color: "LightGreen"
  },
  between: {
    color: "Yellow"
  },
  above: {
    color: "Pink"
  }
};
const geoTip = withStyles(tipStyles)(
  ({ record, series, classes, standardOptions }) => {
    if (series.label === TARGET_NAME) return null;

    const referenceRange = selectFrom(standardOptions.series)
      .where({ label: TARGET_NAME })
      .first()
      .selector(record);

    return (
      <div>
        <div className={classes.title}>
          {new Date(record.pushDate).format("yyyy-MM-dd")}
        </div>
        <div>
          <span
            style={{ backgroundColor: series.style.color }}
            className={classes.tooltipKey}
          />
          {series.label} :{round(record.result, { places: 3 })}
        </div>
        <div>
          {(() => {
            const diffMax = record.result - referenceRange.max;
            const diffMin = record.result - referenceRange.min;

            if (diffMax > 0) {
              return (
                <span className={classes.above}>
                  {`${round(diffMax, {
                    places: 2
                  })}ms above target`}
                </span>
              );
            }
            if (diffMin < 0) {
              return (
                <span className={classes.below}>
                  {`${round(-diffMin, {
                    places: 2
                  })}ms below target`}
                </span>
              );
            }

            return <span className={classes.between}>meets target</span>;
          })()}
        </div>
      </div>
    );
  }
);

const PLATFORMS = [
  {
    id: "g5",
    label: "Moto G5 (arm7)",
    filter: {
      eq: {
        platform: "android-hw-g5-7-0-arm7-api-16",
        options: "pgo"
      }
    }
  },
  {
    id: "p2-aarch64",
    label: "Pixel 2 (aarch64)",
    filter: {
      eq: {
        options: "pgo",
        platform: "android-hw-p2-8-0-android-aarch64"
      }
    }
  }
];

const COMBO_TABLE = {
  header: ["repo", "browser", "browserLabel", "test", "suite", "suiteLabel", "filter"],
  data: [
    [
      MOZILLA_CENTRAL,
      "geckoview",
      "Geckoview",
      { missing: "test" },
      "scn-power-idle",
      "about:blank page",
      {
        eq: {
          framework: 10,
          repo: "mozilla-central",
          suite: ["raptor-scn-power-idle-geckoview"]
        }
      }
    ],
    // [MOZILLA_CENTRAL, 'refbrow', 'Reference Browser', 'scn-power-idle', 'about:blank page', {eq: {framework: 10, repo: 'mozilla-central', suite: ['raptor-scn-power-idle-refbrow-power']}}],
    [
      MOZILLA_CENTRAL,
      "fenix",
      "Firefox Preview",
      { missing: "test" },
      "scn-power-idle",
      "about:blank page",
      {
        eq: {
          framework: 10,
          repo: "mozilla-central",
          suite: ["raptor-scn-power-idle-fenix"]
        }
      }
    ],
    [
      MOZILLA_CENTRAL,
      "fennec68",
      "Firefox ESR",
      { missing: "test" },
      "scn-power-idle",
      "about:blank page",
      {
        eq: {
          framework: 10,
          repo: "mozilla-central",
          suite: ["raptor-scn-power-idle-fennec68"]
        }
      }
    ],

    [
      MOZILLA_CENTRAL,
      "geckoview",
      "Geckoview",
      { missing: "test" },
      "scn-power-idle-bg",
      "idle background",
      {
        eq: {
          framework: 10,
          repo: "mozilla-central",
          suite: ["raptor-scn-power-idle-bg-geckoview"]
        }
      }
    ],
    // [MOZILLA_CENTRAL, 'refbrow', 'Reference Browser', 'scn-power-idle-bg', 'idle background', {eq: {framework: 10, repo: 'mozilla-central', suite: ['raptor-scn-power-idle-bg-refbrow-power']}}],
    [
      MOZILLA_CENTRAL,
      "fenix",
      "Firefox Preview",
      { missing: "test" },
      "scn-power-idle-bg",
      "idle background",
      {
        eq: {
          framework: 10,
          repo: "mozilla-central",
          suite: ["raptor-scn-power-idle-bg-fenix"]
        }
      }
    ],
    [
      MOZILLA_CENTRAL,
      "fennec68",
      "Firefox ESR",
      { missing: "test" },
      "scn-power-idle-bg",
      "idle background",
      {
        eq: {
          framework: 10,
          repo: "mozilla-central",
          suite: ["raptor-scn-power-idle-bg-fennec68"]
        }
      }
    ],

    [
      MOZILLA_CENTRAL,
      "geckoview",
      "Geckoview",
      { missing: "test" },
      "speedometer",
      "Speedometer",
      {
        eq: {
          framework: 10,
          repo: "mozilla-central",
          suite: ["raptor-speedometer-geckoview"]
        }
      }
    ],
    // [MOZILLA_CENTRAL, 'refbrow', 'Reference Browser', 'speedometer', 'Speedometer', {eq: {framework: 10, repo: 'mozilla-central', suite: ['raptor-speedometer-refbrow-power']}}],
    [
      MOZILLA_CENTRAL,
      "fenix",
      "Firefox Preview",
      { missing: "test" },
      "speedometer",
      "Speedometer",
      {
        eq: {
          framework: 10,
          repo: "mozilla-central",
          suite: ["raptor-speedometer-fenix"]
        }
      }
    ],
    [
      MOZILLA_CENTRAL,
      "fennec68",
      "Firefox ESR",
      { missing: "test" },
      "speedometer",
      "Speedometer",
      {
        eq: {
          framework: 10,
          repo: "mozilla-central",
          suite: ["raptor-speedometer-fennec68"]
        }
      }
    ],
    [
      MOZILLA_CENTRAL,
      "geckoview",
      "Geckoview",
      { missing: "test" },
      "unity",
      "Unity",
      {
        eq: {
          framework: 10,
          repo: "mozilla-central",
          suite: ["raptor-unity-webgl-geckoview"]
        }
      }
    ],
    [
      MOZILLA_CENTRAL,
      "fenix",
      "Firefox Preview",
      { missing: "test" },
      "unity",
      "Unity",
      {
        eq: {
          framework: 10,
          repo: "mozilla-central",
          suite: ["raptor-unity-webgl-fenix"]
        }
      }
    ],
    [
      MOZILLA_CENTRAL,
      "fennec68",
      "Firefox ESR",
      { missing: "test" },
      "unity",
      "Unity",
      {
        eq: {
          framework: 10,
          repo: "mozilla-central",
          suite: ["raptor-unity-webgl-fennec68"]
        }
      }
    ]
  ]
};
const COMBOS = COMBO_TABLE.data.map(row => Data.zip(COMBO_TABLE.header, row));

export {
  TARGET_NAME,
  REFERENCE_BROWSER,
  REFERENCE_COLOR,
  GEOMEAN_DESCRIPTION,
  SHOW_TELEMETRY,
  geoTip,
  COMBOS,
  PLATFORMS
};
