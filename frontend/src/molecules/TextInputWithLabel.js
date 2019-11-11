import React from 'react';

import { Error, Label, TextInput } from '../atoms';

export function TextInputWithLabel({ error, label, inputRef, ...inputProps }) {
  return (
    <Label className="flex flex-column ph2 pv2 fw6 w-100 border-box">
      {label}
      <TextInput ref={inputRef} {...inputProps} />
      {error && <Error>{error}</Error>}
    </Label>
  );
}
