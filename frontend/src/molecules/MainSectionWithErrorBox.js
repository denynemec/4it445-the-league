import React from 'react';

import { ErrorBox, Layout, MainSection } from '../atoms';

export const MainSectionWithErrorBox = ({ children, errorList }) => {
  const filteredErrorList = errorList.filter(
    ({ error }) => typeof error !== 'undefined' && error !== null,
  );

  return (
    <MainSection>
      {filteredErrorList.length !== 0 && (
        <Layout pb3>
          <ErrorBox errorList={filteredErrorList} />
        </Layout>
      )}
      {children}
    </MainSection>
  );
};
