import { useQuery } from '@apollo/client';
import { GET_QUESTIONS } from '../graphql/query';

function useQuestion() {
  const { data, error, loading } = useQuery(GET_QUESTIONS, {
    fetchPolicy: 'network-only',
  });

  return { data, error, loading };
}

export default useQuestion;
