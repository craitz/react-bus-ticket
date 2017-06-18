import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import PropTypes from 'prop-types';

const TooltipOverlay = ({ text, position, children }) => {
  const tooltip = <Tooltip id="tooltip">{text}</Tooltip>
  return (
    <OverlayTrigger placement={position} overlay={tooltip}>
      {children}
    </OverlayTrigger>
  );
};

TooltipOverlay.PropTypes = {
  text: PropTypes.string.isRequired,
  position: PropTypes.string
}

TooltipOverlay.defaultProps = {
  position: "bottom"
}

export default TooltipOverlay;