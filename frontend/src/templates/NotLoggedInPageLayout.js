import React from 'react';

import { NoContainerSection } from '../atoms';
import { NotLoggedInHeader } from '../organisms';
import { Col } from 'reactstrap';
import './customStyles.css';

export const NotLoggedInPageLayout = ({ children }) => (
  <>
    <NotLoggedInHeader />

    <NoContainerSection className="notLoggedBackground p-5">
      <div className="notLoggedBack">
        <Col sm={{ size: 6, offset: 3 }} className="p-5 backgroundLight">
          {children}
        </Col>
      </div>
    </NoContainerSection>
  </>
);
