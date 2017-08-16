import React, { Component } from 'react';
import { withSpinner } from '../shared/hoc';
import FontAwesome from 'react-fontawesome';
import Button from 'react-toolbox/lib/button/Button';

const ButtonContent = ({ icon }) => <i className="material-icons">{icon}</i>;
const ContentWithSpinner = withSpinner(ButtonContent);

const SpinnerButton = ({ icon, spinning, className, onClick, type = "button" }) => {
  const buttonClass = `${className} spinner-button`;
  return (
    <Button
      type={type}
      floating
      accent
      disabled={spinning}
      className={buttonClass}
      onClick={onClick}
    >
      <ContentWithSpinner
        icon={icon}
        active={spinning}
      />
    </Button>
  );
};

export default SpinnerButton;