import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Grow';

const styles = {
  table: {
    background: 'rgba(0, 0, 0, .8)',
    color: 'white',
    borderRadius: '4px',
    pointerEvents: 'none',
    borderCollapse: 'collapse',
  },
  tooltipKey: {
    display: 'inline-block',
    width: '10px',
    height: '10px',
    marginRight: '10px',
  },
};

function CustomTooltip({ classes, tooltipModel }) {
  const titleLines = tooltipModel.title || [];
  const bodyLines = tooltipModel.body
    ? tooltipModel.body.map(bodyItem => bodyItem.lines)
    : [];
  const footerLines = tooltipModel.footer || [];

  return (
    <Fade in={tooltipModel.opacity === 1}>
      <table className={classes.table}>
        <thead>
          {titleLines.map(title => (
            <tr>
              <th>{title}</th>
            </tr>
          ))}
        </thead>
        <tbody>
          {bodyLines.map((body, i) => {
            const { backgroundColor, borderColor } = tooltipModel.labelColors[
              i
            ];

            return (
              <tr>
                <td>
                  <span
                    style={{
                      background: backgroundColor,
                      borderColor,
                    }}
                    className={classes.tooltipKey}
                  />
                  {body}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          {footerLines.map(footer => (
            <tr>
              <td dangerouslySetInnerHTML={{ __html: footer }} />
            </tr>
          ))}
        </tfoot>
      </table>
    </Fade>
  );
}

export default withStyles(styles)(CustomTooltip);
