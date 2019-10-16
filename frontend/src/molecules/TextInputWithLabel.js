import React, { useCallback } from 'react';

import { Error, Label, TextInput } from '../atoms';

export const TextInputWithLabel = ({
  error,
  label,
  onChange,
  ...inputProps
}) => {
  const memoizedOnChange = useCallback(
    event => {
      onChange(event.target.value);
    },
    [onChange],
  );

  return (
    <Label className="flex flex-column ph2 pv3 fw6">
      {label}
      <TextInput onChange={memoizedOnChange} {...inputProps} />
      {error && <Error>{error}</Error>}
    </Label>
  );
};
