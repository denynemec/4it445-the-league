import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

export const ErrorBox = ({ className, children }) => (
  <div
    className={classNames(
      'red w-100 pa2 bg-light-red ba br4 b--dark-red shadow-5 flex items-center',
      className,
    )}
  >
    <FontAwesomeIcon
      className={classNames('ph2 black fa-2x')}
      icon={faExclamationTriangle}
    />

    <div className={classNames('pa3 black')}>{children}</div>
  </div>
);
