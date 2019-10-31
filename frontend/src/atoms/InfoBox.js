import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

export const InfoBox = ({ className, infoList }) => (
  <div
    className={classNames(
      'red w-100 pa2 bg-spring-green ba br4 b--dark-green shadow-5 flex items-center',
      className,
    )}
  >
    <FontAwesomeIcon
      className={classNames('ph2 black fa-2x')}
      icon={faInfoCircle}
    />
    <div className={classNames('flex flex-column')}>
      {infoList.map(({ info, id }) => (
        <div key={id} className={classNames('pa3 black')}>
          {info}
        </div>
      ))}
    </div>
  </div>
);
