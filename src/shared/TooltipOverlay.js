import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

const TooltipOverlay = ({ text, position = "bottom", children }) => {
  const tooltip = <Tooltip id="tooltip">{text}</Tooltip>
  return (
    <OverlayTrigger placement={position} overlay={tooltip}>
      {children}
    </OverlayTrigger>
  );
};

export default TooltipOverlay;