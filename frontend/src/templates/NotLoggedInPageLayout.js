import React from 'react';

import { NoContainerSectionWithErrorBox } from '../molecules';
import { NotLoggedInHeader } from '../organisms';
import { Container } from 'reactstrap';
import './customStyles.css';

export const NotLoggedInPageLayout = ({ children, errorList }) => (
  <>
    <NotLoggedInHeader />

    <NoContainerSectionWithErrorBox
      errorList={errorList || []}
      className="notLoggedBackground p-5"
    >
      <div>
        <Container className="p-5 backgroundLightNotLogged">
          {children}
        </Container>
      </div>
    </NoContainerSectionWithErrorBox>
  </>
);
