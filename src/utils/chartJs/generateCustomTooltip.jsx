import React from 'react';
import ReactDOM from 'react-dom';
import CustomTooltip from './CustomTooltip';

const generateCustomTooltip = (canvas, tooltipModel, series) => {
  let tooltipContainer = document.getElementById('tooltip-container');

  if (!tooltipContainer) {
    tooltipContainer = document.createElement('div');
    tooltipContainer.id = 'tooltip-container';
    canvas.parentNode.appendChild(tooltipContainer);
  }

  ReactDOM.render(
    <CustomTooltip tooltipModel={tooltipModel} series={series} />,
    tooltipContainer
  );

  const positionY = canvas.offsetTop;
  const positionX = canvas.offsetLeft;
  const heightTooltip = tooltipContainer.clientHeight;
  const widthTooltip = tooltipContainer.clientWidth;

  tooltipContainer.style.position = 'absolute';

  if (tooltipModel.yAlign === 'bottom') {
    tooltipContainer.style.top = `${positionY +
      tooltipModel.caretY -
      heightTooltip}px`;
  } else {
    tooltipContainer.style.top = `${positionY + tooltipModel.caretY}px`;
  }

  tooltipContainer.style.left = `${positionX +
    tooltipModel.caretX -
    0.5 * widthTooltip}px`;
  // eslint-disable-next-line no-underscore-dangle
  tooltipContainer.style.fontFamily = tooltipModel._bodyFontFamily;
  // eslint-disable-next-line no-underscore-dangle
  tooltipContainer.style.fontSize = `${tooltipModel._bodyFontSize}px`;
};

export default generateCustomTooltip;
