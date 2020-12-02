import { applyMiddleware, createStore } from 'redux';
import createReducer from './reducers';
import thunk from 'redux-thunk';

const store = createStore(createReducer(), applyMiddleware(thunk));

// store.asyncReducers = {};

// export const injectReducer = (key, reducer) => {
//   if (store.asyncReducers[key]) {
//     return;
//   }
//   store.asyncReducers[key] = reducer;
//   store.replaceReducer(createReducer(store.asyncReducers));
//   return store;
// };

export default store;
