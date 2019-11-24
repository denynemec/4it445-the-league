import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  Card,
  CardFooter,
  CardBody,
  CardText,
  CardImg,
  ListGroup,
  ListGroupItem,
  Col,
} from 'reactstrap';

export const LayoutedLobby = ({
  eventName,
  joinedUsers,
  maxUsers,
  minUsers,
  name,
  id,
  footer,
}) => {
  const { t } = useTranslation();

  return (
    <Col sm="4">
      <Card className="mt-5">
        <CardImg
          top
          width="100%"
          src="https://oddschanger.com/wp-content/uploads/2019/03/PA-40059445-min.jpg"
          alt={eventName}
        />
        <CardBody>
          <CardText>
            <ListGroup flush>
              <ListGroupItem>
                {t('Molecules.LayoutedLobby.LobbyName', { name })}
              </ListGroupItem>
              <ListGroupItem>
                {t('Molecules.LayoutedLobby.EventName', { eventName })}
              </ListGroupItem>
              <ListGroupItem>
                {t('Molecules.LayoutedLobby.Players', {
                  joinedUsers,
                  maxUsers,
                })}
              </ListGroupItem>
            </ListGroup>
          </CardText>
        </CardBody>
        <CardFooter>{footer}</CardFooter>
      </Card>
    </Col>
  );
};
