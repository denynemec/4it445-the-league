import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import PATHNAMES from '../pathnames';

import {
  Card,
  Button,
  CardFooter,
  CardBody,
  CardTitle,
  CardText,
  CardImg,
  ListGroup,
  ListGroupItem,
} from 'reactstrap';

export const LayoutedLobby = ({
  eventName,
  joinedUsers,
  maxUsers,
  minUsers,
  name,
  id,
}) => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <Card>
      <CardImg
        top
        width="100%"
        src="https://oddschanger.com/wp-content/uploads/2019/03/PA-40059445-min.jpg"
        alt={eventName}
      />
      <CardBody>
        <CardText>
          <ListGroup flush>
            <ListGroupItem>Název: {name}</ListGroupItem>
            <ListGroupItem>
              {t('Molecules.LayoutedLobby.EventName', { eventName })}
            </ListGroupItem>
            <ListGroupItem>Hráči: {`${joinedUsers}/${maxUsers}`}</ListGroupItem>
          </ListGroup>
        </CardText>
      </CardBody>
      <CardFooter>
        <Button
          block
          color="primary"
          onClick={() => history.push(PATHNAMES.getLobbyDetail(id))}
        >
          {t('Organisms.LobbyList.GoToGroupDetailButton')}
        </Button>
      </CardFooter>
    </Card>
  );
};
