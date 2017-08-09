import React, { Component } from 'react';
import TooltipOverlay from '../shared/TooltipOverlay';
import Button from 'react-toolbox/lib/button/Button';
import Menu from 'react-toolbox/lib/menu/Menu';
import FontAwesome from 'react-fontawesome';
// import PropTypes from 'prop-types';

class ButtonMenu extends Component {
  handleButtonClick = () => this.setState({ active: !this.state.active });
  handleMenuHide = () => this.setState({ active: false });

  constructor(props) {
    super(props);

    this.state = {
      active: false
    };

    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleMenuHide = this.handleMenuHide.bind(this);
  }

  handleButtonClick() {
    this.setState({
      active: !this.state.active
    });
  }

  handleMenuHide() {
    this.setState({
      active: false
    });
  }

  render() {
    const { tooltip, className, icon, mini = false, tooltipPosition = "bottom" } = this.props;
    const buttonClass = mini ? 'open-menu-opcoes-mini' : 'open-menu-opcoes';

    return (
      <div className={className}>
        <TooltipOverlay text={tooltip} position={tooltipPosition}>
          <Button
            accent
            floating
            mini={mini}
            onClick={this.handleButtonClick}
            icon={<FontAwesome name={icon} />}
            className="mui--z2"
          />
        </TooltipOverlay>
        <Menu position="topRight"
          active={this.state.active}
          onHide={this.handleMenuHide}
          className={buttonClass}
        >
          {this.props.children}
        </Menu>
      </div>
    );
  }
}

// ButtonMenu.PropTypes = {}
// ButtonMenu.defaultProps = {}

export default ButtonMenu;