import React, { useState } from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import authReducer from './store/reducers/auth'
import expenseReducer from './store/reducers/expenses'

import ReduxThunk from 'redux-thunk';

import MainNavigator from './navigation/MainNavigator';

const rootReducer = combineReducers({
  auth: authReducer,
  expense: expenseReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  return (
    <Provider store={store}>
      <MainNavigator />
    </Provider>
  );
}
