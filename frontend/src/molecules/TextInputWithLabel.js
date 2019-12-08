import React from 'react';

import { FormGroup, Label, Input, FormFeedback} from 'reactstrap';

export function TextInputWithLabel({ error, label, inputRef, ...inputProps }) {
  return (
    <FormGroup>
      <Label className="flex flex-column ph2 pv2 fw6 w-100 border-box">
        {label}
        <Input invalid={error ? true : false} ref={inputRef} {...inputProps} />
        {error && <FormFeedback>{error}</FormFeedback>}
      </Label>
    </FormGroup>
  );
}
