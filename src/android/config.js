/* eslint-disable */


import React from "react";
import { withStyles } from "@material-ui/core";
import { selectFrom } from "../vendor/vectors";
import { GMTDate as Date } from "../vendor/dates";
import { round } from "../vendor/math";
import { HelpIcon } from '../utils/icons';

const TARGET_NAME = "Fennec64 -20%";
const REFERENCE_BROWSER = ['fennec64'];
const REFERENCE_COLOR = '#45a1ff44';
const GEOMEAN_DESCRIPTION = {title: "more information", url:"https://github.com/mozilla-frontend-infra/firefox-health-dashboard/blob/master/docs/about-pageload#about---site-load-times", icon:HelpIcon};

const tipStyles = {
    below: {
        color: 'LightGreen',
    },
    between: {
        color: 'Yellow',
    },
    above: {
        color: 'Pink',
    },
};
const geoTip = withStyles(tipStyles)(
    ({
         record, series, classes, standardOptions,
     }) => {
        if (series.label === TARGET_NAME) return null;

        const referenceRange = selectFrom(standardOptions.series)
            .where({ label: TARGET_NAME })
            .first()
            .selector(record);


        return (
            <div>
                <div className={classes.title}>
                    {new Date(record.pushDate).format('yyyy-MM-dd')}
                </div>
                <div>
          <span
              style={{ backgroundColor: series.style.color }}
              className={classes.tooltipKey}
          />
                    {series.label}
                    {' '}:
                    {round(record.result, { places: 3 })}
                </div>
                <div>
                    {(() => {
                        const diffMax = record.result - referenceRange.max;
                        const diffMin = record.result - referenceRange.min;

                        if (diffMax > 0) {
                            return (
                                <span className={classes.above}>
                  {`${round(diffMax, {
                      places: 2,
                  })}ms above target`}
                </span>
                            );
                        }
                        if (diffMin < 0 ){
                            return (
                                <span className={classes.below}>
                {`${round(-diffMin, {
                    places: 2,
                })}ms below target`}
              </span>
                            );
                        }

                        return (
                            <span className={classes.between}>meets target</span>
                        );


                    })()}
                </div>
            </div>
        );
    },
);



export { TARGET_NAME, REFERENCE_BROWSER, REFERENCE_COLOR, GEOMEAN_DESCRIPTION, geoTip };
