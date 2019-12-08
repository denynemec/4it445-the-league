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
  Badge,
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

  let lobbyStatusColor = 'danger';
  let lobbyStatusText = t('Molecules.LayoutedLobby.NotEnough');

  if (joinedUsers >= minUsers && joinedUsers < maxUsers) {
    lobbyStatusColor = 'warning';
    lobbyStatusText = t('Molecules.LayoutedLobby.Enough');
  } else if (joinedUsers === maxUsers) {
    lobbyStatusColor = 'success';
    lobbyStatusText = t('Molecules.LayoutedLobby.Full');
  }

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
                <Badge color={`${lobbyStatusColor}`}>{lobbyStatusText}</Badge>
              </ListGroupItem>
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
