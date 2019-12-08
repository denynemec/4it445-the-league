import { getJwtToken } from './jwtToken';

export const getLoginSuccessPayload = async ({ userId, dbConnection }) => {
  const token = getJwtToken({ userId });

  const dbResponse = await dbConnection.query(
    'SELECT nickname FROM users WHERE user_id = ? AND active = true LIMIT 1;',
    [userId],
  );

  const dbPrivilegesResponse = await dbConnection.query(
    'SELECT permission.permission_id, name FROM permission INNER JOIN role_permission ON (permission.permission_id = role_permission.permission_id) INNER JOIN user_role ON (user_role.role_id = role_permission.role_id) WHERE user_role.user_id = ?;',
    [userId],
  );

  const privileges = dbPrivilegesResponse.map(privilege => privilege.name);

  const loginSuccessPayload = {
    token,
    user: { nickname: dbResponse[0].nickname },
    privileges,
  };

  return loginSuccessPayload;
};
