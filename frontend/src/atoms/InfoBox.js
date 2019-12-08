import React from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import { UncontrolledAlert } from 'reactstrap';

export const InfoBox = ({ className, infoList }) => {
  const { t } = useTranslation();

  return (
    <UncontrolledAlert color="info">
      <h2>
        <FontAwesomeIcon icon={faInfoCircle} />
        {t('Atoms.InfoBox.Title')}
      </h2>
      {infoList.map(({ info, id }) => (
        <div key={id}>{info}</div>
      ))}
    </UncontrolledAlert>
  );
};
