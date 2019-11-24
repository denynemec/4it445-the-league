import React from 'react';

import { Error, Label } from '../atoms';
import { FormGroup, Input } from 'reactstrap';

export function TextInputWithLabel({ error, label, inputRef, ...inputProps }) {
  return (
    <FormGroup>
      <Label className="flex flex-column ph2 pv2 fw6 w-100 border-box">
        {label}
        <Input ref={inputRef} {...inputProps} />
        {error && <Error>{error}</Error>}
      </Label>
    </FormGroup>
  );
}
