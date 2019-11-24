import React from 'react';
import classNames from 'classnames';
import { ErrorBox } from '../atoms';

export const NotLoggedMainSectionWithErrorBox = ({
  children,
  errorList,
  className,
}) => (
  <div className={classNames(className)}>
    <ErrorBox className="pb3" errorList={errorList} />

    {children}
  </div>
);
