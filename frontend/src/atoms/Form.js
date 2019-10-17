import React, { useCallback } from 'react';
import classNames from 'classnames';

export const Form = ({ className, onSubmit, ...props }) => {
  const memoizedOnSubmit = useCallback(
    event => {
      event.preventDefault();
      onSubmit();
    },
    [onSubmit],
  );

  return (
    <form
      className={classNames(className)}
      onSubmit={memoizedOnSubmit}
      {...props}
    />
  );
};
