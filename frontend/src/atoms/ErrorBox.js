import React from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { UncontrolledAlert } from 'reactstrap';
export const ErrorBox = ({ className, errorList }) => {
  const filteredErrorList = errorList.filter(
    ({ error }) => typeof error !== 'undefined' && error !== null,
  );
  const { t } = useTranslation();

  return (
    filteredErrorList.length !== 0 && (
      <UncontrolledAlert color="danger">
        <h2>
          <FontAwesomeIcon
            className="text-danger mr-3"
            icon={faExclamationTriangle}
          />
          {t('Atoms.Error.ErrorTitle')}
        </h2>
        {filteredErrorList.map(({ error, id }) => (
          <div key={id}>{error}</div>
        ))}
      </UncontrolledAlert>
    )
  );
};
