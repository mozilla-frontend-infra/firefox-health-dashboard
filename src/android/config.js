/* eslint-disable */

import React from "react";
import { withStyles } from "@material-ui/core";
import { selectFrom } from "../vendor/vectors";
import { GMTDate as Date } from "../vendor/dates";
import { round } from "../vendor/math";
import { HelpIcon } from "../utils/icons";
import { Data } from "../vendor/datas";

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

const COMBO_TABLE = {
  header: ["browser", "browserLabel", "suite", "suiteLabel", "filter"],
  data: [
    [
      "geckoview",
      "Geckoview",
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
    // ['refbrow', 'Reference Browser', 'scn-power-idle', 'about:blank page', {eq: {framework: 10, repo: 'mozilla-central', suite: ['raptor-scn-power-idle-refbrow-power']}}],
    [
      "fenix",
      "Firefox Preview",
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
      "fennec68",
      "Firefox ESR",
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
      "geckoview",
      "Geckoview",
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
    // ['refbrow', 'Reference Browser', 'scn-power-idle-bg', 'idle background', {eq: {framework: 10, repo: 'mozilla-central', suite: ['raptor-scn-power-idle-bg-refbrow-power']}}],
    [
      "fenix",
      "Firefox Preview",
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
      "fennec68",
      "Firefox ESR",
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
      "geckoview",
      "Geckoview",
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
    // ['refbrow', 'Reference Browser', 'speedometer', 'Speedometer', {eq: {framework: 10, repo: 'mozilla-central', suite: ['raptor-speedometer-refbrow-power']}}],
    [
      "fenix",
      "Firefox Preview",
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
      "fennec68",
      "Firefox ESR",
      "speedometer",
      "Speedometer",
      {
        eq: {
          framework: 10,
          repo: "mozilla-central",
          suite: ["raptor-speedometer-fennec68"]
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
  COMBOS
};
