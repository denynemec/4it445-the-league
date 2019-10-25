import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export const LoadingSpinner = () => (
  <div className="center black-60">
    <div className="tc f4 pa4">
      <FontAwesomeIcon icon={faSpinner} spin />
    </div>
  </div>
);
