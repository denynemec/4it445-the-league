import React from 'react';

import { Error, Label, Select } from '../atoms';

export const SelectWithLabel = ({ error, label, ...selectProps }) => (
  <Label className="flex flex-column ph2 pv2 fw6 w-100 border-box">
    {label}
    <Select {...selectProps} />
    {error && <Error>{error}</Error>}
  </Label>
);
