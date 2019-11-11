import React from 'react';
import { useField } from 'formik';

import { TextInputWithLabel } from '../molecules';

export function Field(props) {
  const [field, meta] = useField(props);

  const error = meta.touched && meta.error ? meta.error : undefined;

  return <TextInputWithLabel error={error} {...field} {...props} />;
}
