import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

export const Select = ({ className, data = [], ...props }) => {
  const { t } = useTranslation();

  return (
    <select
      className={classNames('ba b--black-20 mv2 db w-100 h2', className)}
      {...props}
    >
      <option value={-1}>{t('Atoms.Select.Placeholder')}</option>

      {data.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
};
