import React from 'react';
import classNames from 'classnames';

export const Layout = ({ children, ...props }) => (
  <div className={classNames(props)}>{children}</div>
);
