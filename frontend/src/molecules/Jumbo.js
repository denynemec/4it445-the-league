import React from 'react';

import { Heading, Paragraph } from '../atoms';

import { Jumbotron } from 'reactstrap';

export const Jumbo = ({ header, mainBody, footer, children }) => {
  return (
    <Jumbotron>
      <Heading size="xl" className="display-4">
        {header}
      </Heading>
      <Paragraph className="lead">{mainBody}</Paragraph>
      <hr className="my-2" />
      {children}
      <Paragraph className="lead">{footer}</Paragraph>
    </Jumbotron>
  );
};
