import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import PATHNAMES from '../pathnames';

import {
  Card,
  Button,
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
  ...props
}) => {
  const { t } = useTranslation();
  const history = useHistory();

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
        <CardFooter>{props.footer}</CardFooter>
      </Card>
    </Col>
  );
};
