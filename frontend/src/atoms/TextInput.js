import React, { forwardRef } from 'react';
import classNames from 'classnames';

export const TextInput = forwardRef(function TextInput(
  { type, className, ...inputProps },
  ref,
) {
  const isTextarea = type === 'textarea';
  const Component = isTextarea ? 'textarea' : 'input';

  return (
    <Component
      ref={ref}
      type={type}
      className={classNames('input-reset ba b--black-20 pa2 mv2 db', className)}
      style={isTextarea ? { resize: 'vertical' } : {}}
      {...inputProps}
    />
  );
});
