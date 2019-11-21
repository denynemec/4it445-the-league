import React from 'react';
import classNames from 'classnames';

export const Paragraph = ({ children, className }) => (
  <p className={classNames(className)}>{children}</p>
);
