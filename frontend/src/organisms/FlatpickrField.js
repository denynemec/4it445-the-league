import React from 'react';
import { Flatpickr } from '../atoms/Flatpickr';
import { getIn } from 'formik';
import { FormGroup, Label } from 'reactstrap';

function FlatpickrField({
  field: { onChange, onBlur, ...field },
  form: { errors, touched },
  label,
  ...props
}) {
  const id = props.id || field.name;

  return (
    <FormGroup>
      <Label className="flex flex-column ph2 pv2 fw6 w-100 border-box">
        {label}
        <Flatpickr
          {...field}
          {...props}
          id={id}
          onChange={e => {
            console.log(e.target.value);
            onChange(e);
            onBlur(e);
          }}
          error={getIn(touched, field.name) && getIn(errors, field.name)}
        />
      </Label>
    </FormGroup>
  );
}

export { FlatpickrField };
