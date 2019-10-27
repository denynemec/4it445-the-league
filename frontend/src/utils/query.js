import { useLocation } from 'react-router-dom';

const useQuery = () => new URLSearchParams(useLocation().search);

export const useGetQueryParam = param => {
  const query = useQuery();

  return query.get(param);
};
