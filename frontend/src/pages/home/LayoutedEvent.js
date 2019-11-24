import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { NewLobbyForm } from '../../organisms';
import PATHNAMES from '../../pathnames';
import { formatDate } from '../../utils';

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

export const LayoutedEvent = ({
  description,
  startDate,
  endDate,
  name,
  id,
  minUsers,
  maxUsers,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [addNewLobbyModalIsOpen, setAddNewLobbyModalIsOpen] = useState(false);

  const onGoToDetailClick = useCallback(
    () => history.push(PATHNAMES.getEventDetail(id)),
    [history, id],
  );

  const onOpenModalClick = useCallback(() => setAddNewLobbyModalIsOpen(true), [
    setAddNewLobbyModalIsOpen,
  ]);

  const onCloseModalClick = useCallback(
    () => setAddNewLobbyModalIsOpen(false),
    [setAddNewLobbyModalIsOpen],
  );

  return (
    <Col sm="4">
      <Card className="mt-5">
        <CardImg
          top
          width="100%"
          src="https://oddschanger.com/wp-content/uploads/2019/03/PA-40059445-min.jpg"
        />
        <CardBody>
          <CardText>
            <ListGroup flush>
              <ListGroupItem>
                {t('Page.Home.EventName', { name })}
              </ListGroupItem>
              <ListGroupItem>
                {t('Page.Home.EventStartDateLabel', {
                  date: formatDate(startDate),
                })}
              </ListGroupItem>
              <ListGroupItem>
                {t('Page.Home.EventEndDateLabel', {
                  date: formatDate(endDate),
                })}
              </ListGroupItem>
              <ListGroupItem>{description}</ListGroupItem>
            </ListGroup>
          </CardText>
        </CardBody>
        <CardFooter>
          <Button block color="primary" onClick={onOpenModalClick}>
            {t('Page.Home.AddNewLobbyButton')}
          </Button>
          <NewLobbyForm
            isOpen={addNewLobbyModalIsOpen}
            onCloseClick={onCloseModalClick}
            minUsers={minUsers}
            maxUsers={maxUsers}
            eventName={name}
            eventId={id}
          />
          <Button block color="primary" onClick={onGoToDetailClick}>
            {t('Page.Home.GoToEventDetailButton')}
          </Button>
        </CardFooter>
      </Card>
    </Col>
  );
};
