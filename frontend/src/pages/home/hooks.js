import ENDPOINTS from '../../endpoints';
import { useFetchRequest } from '../../utils';

export const useFetchData = () => {
  const eventListState = useFetchRequest(ENDPOINTS.getEventList());
  const lobbyListState = useFetchRequest(ENDPOINTS.getLobbyList());

  return { eventListState, lobbyListState };
};
