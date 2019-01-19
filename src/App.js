import React, {useReducer, useMemo, useEffect} from 'react';
import './App.css';

import {Provider, Client, query, Connect} from 'urql';
import PouchDB from 'pouchdb-browser';
import debounce from 'lodash/debounce';

const db = new PouchDB('rc');
window.__db = db;

const settingsReducer = (state, action) => {
  switch (action.type) {
    case 'api-key':
      return {...state, apiKey: action.payload};
    case 'username':
      return {...state, username: action.payload};
    case 'repo':
      return {...state, repo: action.payload};
    case 'update':
      return action.payload;
    case '@@pouch/init':
      return action.payload;
    default:
      return state;
  }
};

const defaultSettings = {
  _id: 'settings',
  apiKey: '',
  username: '',
  repo: '',
};

const usePouchDBReducer = (reducerFn, defaultState, documentName: string) => {
  // TODO: pass reducer as arg
  // TODO: pass default settings as arg?
  // TODO: rename
  const [reducerState, dispatchReducer] = useReducer(
    reducerFn,
    defaultState,
  );

  useEffect(async () => {
    const storedDocument = await db.get(documentName);
    if (!storedDocument) {
      await db.put(defaultState);
      const dbDoc = await db.get(documentName);
      dispatchReducer({type: '@@pouch/init', payload: dbDoc});
    } else {
      dispatchReducer({type: '@@pouch/init', payload: storedDocument});
    }
  }, documentName);

  const _saveState = async (state: *) => {
    try {
      const {_rev, ...localSettings} = state;
      const latest = await db.get(documentName);
      const doc = {...latest, ...localSettings};
      await db.put(doc);
    } catch (err) {
      console.error('there was an error saving to pouch');
      console.error(err || err.stack);
    }
  };

  const saveState = debounce(_saveState, 2000);

  const wrappedDispatch = async (action: *) => {
    const newSettings = reducerFn(reducerState, action);
    dispatchReducer(action);
    saveState(newSettings);
  };
  return [reducerState, wrappedDispatch];
};

const App = () => {
  const [settings, dispatchSettings] = usePouchDBReducer(settingsReducer, defaultSettings, 'settings');

  const client = useMemo(
    () =>
      new Client({
        url: 'https://api.github.com/graphql',
        fetchOptions: () => {
          const opts = {
            headers: {
              'Content-Type': 'application/json',
            },
          };
          if (settings.apiKey && settings.apiKey.length === 40) {
            opts.headers = {
              ...opts.headers,
              Authorization: `Bearer ${settings.apiKey}`,
            };
          }
          return opts;
        },
      }),
    [settings.apiKey],
  );

  return (
    <div>
      <Settings state={settings} dispatch={dispatchSettings} />

      <Provider client={client}>
        <Listing repo={settings.repo} username={settings.username} />
      </Provider>
    </div>
  );
};

const Settings = ({state, dispatch}) => {
  return (
    <React.Fragment>
      <label>
        username:{' '}
        <input
          value={state.username || ''}
          onChange={e =>
            dispatch({type: 'username', payload: e.currentTarget.value})
          }
        />
      </label>
      <label>
        api-key:{' '}
        <input
          value={state.apiKey || ''}
          onChange={e =>
            dispatch({type: 'api-key', payload: e.currentTarget.value})
          }
        />
      </label>
      <label>
        repo:{' '}
        <input
          value={state.repo || ''}
          onChange={e =>
            dispatch({type: 'repo', payload: e.currentTarget.value})
          }
        />
      </label>
    </React.Fragment>
  );
};

const reviewQuery = `query ($queryRequested: String!, $queryReviewed: String!) {
  rateLimit {
    cost
    limit
  }
  reviewed: search(query: $queryReviewed, type: ISSUE, first: 20) {
    ...prData
  }
  requested: search(query: $queryRequested, type: ISSUE, first: 20) {
    ...prData
  }
}

fragment prData on SearchResultItemConnection {
  nodes {
    ... on PullRequest {
      id
      author {
        login
      }
      url
      title
      state
      createdAt
      reviews(first: 50) {
        nodes {
          ... on PullRequestReview {
            author {
              login
            }
            state
            submittedAt
          }
        }
      }
    }
  }
}

`;

const Listing = ({repo, username}) => (
  <Connect
    query={query(reviewQuery, {
      queryRequested: `repo:${repo} review-requested:${username} type:pr is:open`,
      queryReviewed: `repo:${repo} reviewed-by:${username} type:pr is:open`,
    })}
  >
    {({fetching, loaded, error, data, refetch}) => (
      <div>
        {fetching && 'fetching...'}
        {loaded && !fetching && 'loaded!'}
        {loaded && (
          <button type="button" onClick={() => refetch({skipCache: true})}>
            re-fetch data
          </button>
        )}
        {loaded &&
          data.requested.nodes.map(pr => (
            <ReviewRequest key={pr.id} pr={pr} username={username} />
          ))}
      </div>
    )}
  </Connect>
);

const ReviewRequest = ({pr, username}) => {
  const hasReviewed =
    pr.reviews.nodes.filter(
      review =>
        review.author.login === username && review.state !== 'COMMENTED',
    ).length > 0;
  const approved = [
    ...pr.reviews.nodes.filter(
      review => review.author.login === username && review.state === 'APPROVED',
    ),
  ].pop();
  const commented =
    pr.reviews.nodes.filter(
      review =>
        review.author.login === username && review.state === 'COMMENTED',
    ).length > 0;
  return (
    <div>
      {!hasReviewed && '🚨'}
      {approved && '✅'}
      {commented && '💬'}
      <a target="_blank" rel="noopener noreferrer" href={pr.url}>
        #{[...pr.url.split('/')].pop()} - {pr.author.login} - {pr.title}
      </a>
    </div>
  );
};

export default App;
