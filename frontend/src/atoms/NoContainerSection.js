import React from 'react';
import classNames from 'classnames';

export const NoContainerSection = ({ children, className }) => (
  <div className={classNames(className)}>{children}</div>
);
