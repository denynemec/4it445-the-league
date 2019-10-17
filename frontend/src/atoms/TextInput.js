import React from 'react';
import classNames from 'classnames';

export const TextInput = ({ className, ...inputProps }) => (
  <input
    type="text"
    className={classNames(
      'input-reset ba b--black-20 pa2 mv2 db w-100',
      className,
    )}
    {...inputProps}
  />
);
