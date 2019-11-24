import React from 'react';

import { NotLoggedMainSectionWithErrorBox } from '../molecules';
import { NotLoggedInHeader } from '../organisms';
import { Container } from 'reactstrap';
import '../index.css';

export const NotLoggedInPageLayout = ({ children, errorList }) => (
  <>
    <NotLoggedInHeader />

    <NotLoggedMainSectionWithErrorBox
      errorList={errorList || []}
      className="notLoggedContainer p-5"
    >
      <div className="notLoggedBack">{children}</div>
    </NotLoggedMainSectionWithErrorBox>
  </>
);
