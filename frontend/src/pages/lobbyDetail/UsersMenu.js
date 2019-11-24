import React from 'react';
import { TabMenu } from 'primereact/tabmenu';

export const UsersMenu = ({ usersInLobby }) => {
  const mappedUsers = usersInLobby.map(usr => ({ label: usr.nickname }));

  return <TabMenu model={mappedUsers} />;
};
