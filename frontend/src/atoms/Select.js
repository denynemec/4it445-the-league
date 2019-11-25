import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from 'reactstrap';

export const Select = ({ className, data = [], ...props }) => {
  const { t } = useTranslation();

  return (
    <Input 
      type="select"
      {...props}
    >
      <option value={-1}>{t('Atoms.Select.Placeholder')}</option>

      {data.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </Input>
  );
};
