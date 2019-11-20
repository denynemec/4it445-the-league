import React from 'react';
import classNames from 'classnames';

export const Paragraph = ({ children, ...props }) => (
  <p className={classNames(props)}>{children}</p>
);
