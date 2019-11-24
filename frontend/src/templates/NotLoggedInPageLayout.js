import React from 'react';

import { NoContainerSectionWithErrorBox } from '../molecules';
import { NotLoggedInHeader } from '../organisms';
import { Col } from 'reactstrap';
import './customStyles.css';

export const NotLoggedInPageLayout = ({ children, errorList }) => (
  <>
    <NotLoggedInHeader />

    <NoContainerSectionWithErrorBox
      errorList={errorList || []}
      className="notLoggedBackground p-5"
    >
      <div className="notLoggedBack">
        <Col sm={{ size: 6, offset: 3 }} className="p-5 backgroundLight">
          {children}
        </Col>
      </div>
    </NoContainerSectionWithErrorBox>
  </>
);
