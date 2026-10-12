// In-browser stand-in for the job-winner backend, for `npm run dev:mock`.
// Runs every request against the backend's real GraphQL schema with the
// backend's demo data, so mismatched queries fail here as they would there.
// Data lives in memory: edits persist until the page reloads.
//
// Dev knobs (URL query params):
//   ?mock-delay=1500                 latency per request in ms (default 250)
//   ?mock-fail=UpdateJobApplication  comma-separated operations that error
import { ApolloLink } from '@apollo/client';
import { Observable } from 'rxjs';
import { buildSchema, graphql, print } from 'graphql';
import dayjs from 'dayjs';
import demoData from './demoData.json';
import schemaSource from './schema.graphqls?raw';

// { dayOffset: n } → 'YYYY-MM-DD' relative to today, like CURRENT_DATE ± n.
const resolveDates = row =>
  Object.fromEntries(
    Object.entries(row).map(([key, value]) => [
      key,
      value && typeof value === 'object' && 'dayOffset' in value
        ? dayjs().add(value.dayOffset, 'day').format('YYYY-MM-DD')
        : value,
    ])
  );

export function createStore(data = demoData) {
  const table = rows => (rows || []).map(resolveDates);
  return {
    profile: data.profile ? resolveDates(data.profile) : null,
    jobApplications: table(data.jobApplications),
    interviews: table(data.interviews),
    offers: table(data.offers),
    frequentUrls: table(data.frequentUrls),
    questions: table(data.questions),
  };
}

const sameId = id => row => String(row.id) === String(id);
const nextId = rows => Math.max(0, ...rows.map(row => Number(row.id))) + 1;

function crud(rows) {
  return {
    all: () => rows,
    byId: id => rows.find(sameId(id)) ?? null,
    add: input => {
      const row = { id: nextId(rows), ...input };
      rows.push(row);
      return row;
    },
    update: input => {
      const row = rows.find(sameId(input.id));
      if (!row) throw new Error(`No record with id ${input.id}`);
      Object.assign(row, input, { id: row.id });
      return row;
    },
    remove: id => {
      const index = rows.findIndex(sameId(id));
      if (index < 0) throw new Error(`No record with id ${id}`);
      return rows.splice(index, 1)[0];
    },
  };
}

// Root resolvers mirroring the backend's Query and Mutation types.
export function createResolvers(store) {
  const apps = crud(store.jobApplications);
  const interviews = crud(store.interviews);
  const offers = crud(store.offers);
  const urls = crud(store.frequentUrls);
  const questions = crud(store.questions);
  const withApplication = row =>
    row && { ...row, jobApplication: () => apps.byId(row.jobApplicationId) };

  return {
    allJobApplication: () => apps.all(),
    jobApplicationById: ({ id }) => apps.byId(id),
    searchJobApplications: ({ searchTerm }) =>
      apps
        .all()
        .filter(app =>
          [app.companyName, app.jobTitle, app.description]
            .join(' ')
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        ),
    profileById: ({ id }) =>
      store.profile && String(store.profile.id) === String(id)
        ? store.profile
        : null,
    allInterview: () => interviews.all().map(withApplication),
    allInterviewByJobApplicationId: ({ jobApplicationId }) =>
      interviews
        .all()
        .filter(row => row.jobApplicationId === jobApplicationId)
        .map(withApplication),
    interviewById: ({ id }) => withApplication(interviews.byId(id)),
    allOffer: () => offers.all().map(withApplication),
    offerByJobApplicationId: ({ jobApplicationId }) =>
      withApplication(
        offers.all().find(row => row.jobApplicationId === jobApplicationId)
      ) ?? null,
    allFrequentUrl: () => urls.all(),
    frequentUrlById: ({ id }) => urls.byId(id),
    allQuestion: () => questions.all(),
    questionById: ({ id }) => questions.byId(id),

    addJobApplication: ({ jobApplicationInput }) =>
      apps.add(jobApplicationInput),
    updateJobApplication: ({ jobApplication }) => apps.update(jobApplication),
    deleteJobApplication: ({ id }) => {
      // Like the database's foreign keys: dependents go with the application.
      const removed = apps.remove(id);
      const owned = row => String(row.jobApplicationId) === String(id);
      store.interviews.splice(
        0,
        Infinity,
        ...store.interviews.filter(r => !owned(r))
      );
      store.offers.splice(0, Infinity, ...store.offers.filter(r => !owned(r)));
      return removed;
    },
    updateProfile: ({ profile }) => Object.assign(store.profile, profile),
    addInterview: ({ interviewInput }) =>
      withApplication(interviews.add(interviewInput)),
    updateInterview: ({ id, interview }) =>
      withApplication(interviews.update({ ...interview, id })),
    deleteInterview: ({ id }) => interviews.remove(id),
    addOffer: ({ offerInput }) => withApplication(offers.add(offerInput)),
    updateOffer: ({ offer }) => withApplication(offers.update(offer)),
    deleteOffer: ({ id }) => offers.remove(id),
    addFrequentUrl: ({ frequentUrlInput }) => urls.add(frequentUrlInput),
    updateFrequentUrl: ({ frequentUrl }) => urls.update(frequentUrl),
    deleteFrequentUrl: ({ id }) => urls.remove(id),
    addQuestion: ({ questionInput }) => questions.add(questionInput),
    updateQuestion: ({ question }) => questions.update(question),
    deleteQuestion: ({ id }) => questions.remove(id),
  };
}

const schema = buildSchema(schemaSource);

const readParams = () => {
  const params = new URLSearchParams(globalThis.location?.search ?? '');
  return {
    delayMs: Number(params.get('mock-delay') ?? 250),
    fail: new Set(
      (params.get('mock-fail') ?? '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
    ),
  };
};

export function createMockLink({ store = createStore(), delayMs, fail } = {}) {
  const params = readParams();
  const latency = delayMs ?? params.delayMs;
  const failing = fail ?? params.fail;
  const rootValue = createResolvers(store);

  return new ApolloLink(
    operation =>
      new Observable(observer => {
        const timer = setTimeout(async () => {
          try {
            const result = failing.has(operation.operationName)
              ? {
                  errors: [
                    { message: `Mock failure for ${operation.operationName}` },
                  ],
                }
              : await graphql({
                  schema,
                  source: print(operation.query),
                  rootValue,
                  variableValues: operation.variables,
                  operationName: operation.operationName,
                });
            observer.next(result);
            observer.complete();
          } catch (error) {
            observer.error(error);
          }
        }, latency);
        return () => clearTimeout(timer);
      })
  );
}
