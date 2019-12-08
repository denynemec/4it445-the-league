import React from 'react';
import classNames from 'classnames';
import { ErrorBox } from '../atoms';
import { Container } from 'reactstrap';

export const NoContainerSectionWithErrorBox = ({
  children,
  errorList,
  className,
}) => (
  <div className={classNames(className)}>
    <Container>
      <ErrorBox className="pb3" errorList={errorList} />
    </Container>

    {children}
  </div>
);
