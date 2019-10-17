import React from 'react';
import classNames from 'classnames';
import { Link as RouterLink } from 'react-router-dom';

export const Link = ({ children, className, noUnderline, ...rest }) => (
  <RouterLink
    className={classNames(
      'link no-underline',
      { 'underline-hover': !noUnderline },
      className,
    )}
    {...rest}
  >
    {children}
  </RouterLink>
);
