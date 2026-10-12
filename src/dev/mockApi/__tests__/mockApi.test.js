import { ApolloClient, InMemoryCache } from '@apollo/client';
import { buildSchema, validate } from 'graphql';
import dayjs from 'dayjs';
import { describe, expect, test } from 'vitest';
import * as mutations from '../../../graphql/mutation';
import * as queries from '../../../graphql/query';
import { createMockLink, createStore } from '..';
import schemaSource from '../schema.graphqls?raw';

const client = (options = {}) =>
  new ApolloClient({
    link: createMockLink({ delayMs: 0, fail: new Set(), ...options }),
    cache: new InMemoryCache(),
    defaultOptions: { query: { fetchPolicy: 'no-cache' } },
  });

describe('UI operations', () => {
  // Keeps the UI's GraphQL documents in step with the backend schema.
  test.each(Object.entries({ ...queries, ...mutations }))(
    '%s is valid against the backend schema',
    (name, document) => {
      const errors = validate(buildSchema(schemaSource), document);
      expect(errors.map(e => e.message)).toEqual([]);
    }
  );
});

describe('mock API', () => {
  test('serves the backend demo data', async () => {
    const api = client();
    const { data } = await api.query({ query: queries.GET_JOB_APPLICATIONS });
    expect(data.allJobApplication).toHaveLength(20);

    const interviews = await api.query({ query: queries.GET_ALL_INTERVIEWS });
    const first = interviews.data.allInterview[0];
    expect(first.jobApplication.companyName).toBe(
      data.allJobApplication[0].companyName
    );
  });

  test('keeps demo dates relative to today', () => {
    const store = createStore({
      jobApplications: [{ id: 1, appliedDate: { dayOffset: -28 } }],
    });
    expect(store.jobApplications[0].appliedDate).toBe(
      dayjs().subtract(28, 'day').format('YYYY-MM-DD')
    );
  });

  test('saves persist until reload', async () => {
    const api = client();
    const { data } = await api.query({ query: queries.GET_JOB_APPLICATIONS });
    const app = data.allJobApplication[0];

    await api.mutate({
      mutation: mutations.UPDATE_JOB_APPLICATION,
      variables: { ...app, status: 'rejected' },
    });

    const after = await api.query({ query: queries.GET_JOB_APPLICATIONS });
    expect(after.data.allJobApplication[0].status).toBe('rejected');
  });

  test('deleting an application also removes its interviews', async () => {
    const api = client();
    const before = await api.query({
      query: queries.GET_INTERVIEWS_BY_JOB_APPLICATION_ID,
      variables: { jobApplicationId: 1 },
    });
    expect(before.data.allInterviewByJobApplicationId.length).toBeGreaterThan(
      0
    );

    await api.mutate({
      mutation: mutations.DELETE_JOB_APPLICATION,
      variables: { id: '1' },
    });

    const after = await api.query({
      query: queries.GET_INTERVIEWS_BY_JOB_APPLICATION_ID,
      variables: { jobApplicationId: 1 },
    });
    expect(after.data.allInterviewByJobApplicationId).toEqual([]);
  });

  test('can simulate a failing operation', async () => {
    const api = client({ fail: new Set(['UpdateJobApplication']) });
    await expect(
      api.mutate({
        mutation: mutations.UPDATE_JOB_APPLICATION,
        variables: {
          id: '1',
          companyName: 'x',
          jobTitle: 'x',
          description: '',
          note: '',
          salaryRange: '',
          status: 'open',
          jobUrl: '',
          appliedDate: '2026-01-01',
        },
      })
    ).rejects.toThrow('Mock failure for UpdateJobApplication');
  });
});
