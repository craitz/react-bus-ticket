import React from 'react';
import { Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

export const ButtonIcon = ({ label, icon, onClick, className, type }) =>
  <Button type={type} className={className} onClick={onClick}>
    <FontAwesome name={icon} />
    {(label.length > 0) && <span className="text-after-icon">{label}</span>}
  </Button>

export const ButtonIconFit = ({ labelAll, labelXs, icon, onClick, className, type }) =>
  <Button type={type} className={className} onClick={onClick}>
    <FontAwesome name={icon} />
    <span className="text-after-icon hidden-xs">{labelAll}</span>
    <span className="text-after-icon hidden-sm hidden-md hidden-lg">{labelXs}</span>
  </Button>
