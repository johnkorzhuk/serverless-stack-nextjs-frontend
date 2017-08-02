// @flow

import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import Link from 'next/link';
import styled from 'styled-components';

import RouterNavItem from './RouteNavItem';

const NavbarBrand = styled(Navbar.Brand)`
  font-weight: bold;
`;

type Props = {
  userToken: string,
  pathname: string,
  onNav: Function,
  onLogOut: Function
};

const NavBar = ({ userToken, pathname, onLogOut, onNav }: Props) =>
  <Navbar fluid collapseOnSelect>
    <Navbar.Header>
      <NavbarBrand>
        <span>
          <Link href="/">
            <a>Scratch</a>
          </Link>
        </span>
      </NavbarBrand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav pullRight>
        {userToken
          ? <NavItem onClick={onLogOut}>Logout</NavItem>
          : [
              <RouterNavItem onClick={onNav} href="/signup" pathname={pathname} key={1}>
                Signup
              </RouterNavItem>,
              <RouterNavItem onClick={onNav} href="/login" pathname={pathname} key={2}>
                Login
              </RouterNavItem>
            ]}
      </Nav>
    </Navbar.Collapse>
  </Navbar>;

export default NavBar;
