// @flow
import type { Children } from 'react';

import React from 'react';
import { NavItem } from 'react-bootstrap';

type Props = {
  href: string,
  pathname: string,
  children: Children
};

const RouteNavItem = ({ href, children, pathname, ...props }: Props) => {
  const match = href === pathname;
  return (
    <NavItem {...props} active={match} href={href}>
      {children}
    </NavItem>
  );
};

export default RouteNavItem;
