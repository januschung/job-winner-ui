import { useQuery } from '@apollo/client';
import { GET_JOB_APPLICATIONS } from '../graphql/query';

function useJobApplications() {
  const { data, error, loading } = useQuery(GET_JOB_APPLICATIONS, {
    fetchPolicy: 'network-only',
  });

  return { data, error, loading };
}

export default useJobApplications;
