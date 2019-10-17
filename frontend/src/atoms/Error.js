import React from 'react';
import classNames from 'classnames';

export const Error = ({ className, ...props }) => (
  <div className={classNames('red', className)} {...props} />
);
