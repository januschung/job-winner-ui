import { useQuery } from '@apollo/client';
import { GET_FREQUENT_URLS } from '../../graphql/query';

function useFrequentUrls() {
    const { data, error, loading } = useQuery(GET_FREQUENT_URLS, {
        fetchPolicy: 'network-only',
    });

    return { data, error, loading };
}

export default useFrequentUrls;
