import React from 'react';
import { useField } from 'formik';

import { SelectWithLabel } from '../molecules';

export const SelectField = props => {
  const [field, meta] = useField(props);

  const error = meta.touched && meta.error ? meta.error : undefined;

  return <SelectWithLabel error={error} {...field} {...props} />;
};
