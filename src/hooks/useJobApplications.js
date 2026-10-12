import { useQuery } from '@apollo/client/react';
import { GET_JOB_APPLICATIONS } from '../graphql/query';

function useJobApplications() {
  const { data, error, loading, refetch } = useQuery(GET_JOB_APPLICATIONS, {
    fetchPolicy: 'network-only',
    // Report loading while retrying after an error, so the skeleton shows.
    notifyOnNetworkStatusChange: true,
  });

  return { data, error, loading, refetch };
}

export default useJobApplications;
