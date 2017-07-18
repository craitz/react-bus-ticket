import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { NavHeader } from './Navigation';
import TooltipOverlay from './TooltipOverlay';
import FontAwesome from 'react-fontawesome';

export const PageHeaderItem = ({ tooltip, glyph, onClick }) =>
  <NavItem href="#">
    <TooltipOverlay text={tooltip} position="top">
      <FontAwesome className="icon-title links search" name={glyph} onClick={onClick} />
    </TooltipOverlay>
  </NavItem>

export const PageHeader = ({ title, className, children }) =>
  <div className="navheader-container">
    <Navbar className={className}>
      <NavHeader label={title} glyph="user"></NavHeader>
      <Nav pullRight className="hidden-xs">
        {children}
      </Nav>
    </Navbar>
  </div>