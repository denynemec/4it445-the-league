import React from 'react';

import { Error, Label, TextInput } from '../atoms';

export const TextInputWithLabel = ({ error, label, ...inputProps }) => (
  <Label className="flex flex-column ph2 pv2 fw6 w-100 border-box">
    {label}
    <TextInput {...inputProps} />
    {error && <Error>{error}</Error>}
  </Label>
);
