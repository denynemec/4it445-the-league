import { getJwtToken } from './jwtToken';

export const getLoginSuccessPayload = async ({ userId, dbConnection }) => {
  const token = getJwtToken({ userId });

  const dbResponse = await dbConnection.query(
    'SELECT nickname FROM users WHERE user_id = ? AND active = true LIMIT 1;',
    [userId],
  );

  // currently mocked - not sure with these names
  const privileges = ['AdministrationPage', 'UploadPlayersToEvent'];

  const loginSuccessPayload = {
    token,
    user: { nickname: dbResponse[0].nickname },
    privileges,
  };

  return loginSuccessPayload;
};
