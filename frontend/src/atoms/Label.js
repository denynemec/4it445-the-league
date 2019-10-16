import React from 'react';
import classNames from 'classnames';

export const Label = ({ className, ...props }) => (
  <label className={classNames('f5 b db', className)} {...props} />
);
