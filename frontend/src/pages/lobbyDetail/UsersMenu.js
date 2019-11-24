import React from 'react';
// import { MultiSelect } from 'primereact/multiselect';
// import { Column } from 'primereact/column';
// import { DataTable } from 'primereact/datatable';
// import { useTranslation } from 'react-i18next';
// import { ColumnGroup } from 'primereact/columngroup';
// import { Row } from 'primereact/row';
import { TabMenu } from 'primereact/tabmenu';

export const UsersMenu = ({ usersInLobby }) => {
  const users = [];

  usersInLobby.map(usr => {
    users.push({ label: usr.nickname });
  });

  return <TabMenu model={users} />;
};
