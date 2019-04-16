// @flow
import {useReducer, useEffect} from 'react';
import debounce from 'lodash/debounce';

export const usePouchDBReducer = (reducerFn, defaultState, db, documentName) => {
  const [reducerState, dispatchReducer] = useReducer(
    reducerFn,
    defaultState,
  );

  useEffect(async () => {
    let storedDocument;
    try {
      storedDocument = await db.get(documentName);
      dispatchReducer({type: '@@pouch/init', payload: storedDocument});
    } catch (e) {
      await db.put(defaultState);
      const dbDoc = await db.get(documentName);
      dispatchReducer({type: '@@pouch/init', payload: dbDoc});
    }
    // if (!storedDocument) {
    //   await db.put(defaultState);
    //   const dbDoc = await db.get(documentName);
    //   dispatchReducer({type: '@@pouch/init', payload: dbDoc});
    // } else {
    //   dispatchReducer({type: '@@pouch/init', payload: storedDocument});
    // }
  }, [documentName]);

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
