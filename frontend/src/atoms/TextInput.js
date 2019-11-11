import React from 'react';
import classNames from 'classnames';

export const TextInput = ({ type, className, ...inputProps }) => {
  const isTextarea = type === 'textarea';
  const Component = isTextarea ? 'textarea' : 'input';

  return (
    <Component
      type={type}
      className={classNames('input-reset ba b--black-20 pa2 mv2 db', className)}
      style={isTextarea ? { resize: 'vertical' } : {}}
      {...inputProps}
    />
  );
};
