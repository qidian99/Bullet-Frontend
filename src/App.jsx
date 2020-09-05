import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { withClientState } from 'apollo-link-state';
import { ApolloLink, Observable, split } from 'apollo-link';
import { setContext } from 'apollo-link-context';

import { HttpLink } from 'apollo-link-http';
import { getMainDefinition } from 'apollo-utilities';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from './reducers';
import 'antd/dist/antd.css';
import './App.css';

// generated by Fragment Matcher plugin

import AccountCenter from './components/AccountCenter';
import AccountSettings from './components/AccountSettings';
import BasicLayout from './components/BasicLayout';
import User from './components/User';
import Workplace from './components/Workplace';
import VideoBullets from './components/VideoBullets';
import ModalView from './components/CreateRoomModal';


// Create an http link:
const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
});

const cache = new InMemoryCache({
  dataIdFromObject: (object) => object[`${object.__typename.toLowerCase()}Id`],
});

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBlZXJsZXNzMDciLCJpYXQiOjE1OTkyNTQ3NjYsImV4cCI6MTYwMjg1NDc2Nn0.Qz-9D3CbhjMcOP-uIfRiRDkoksJIXLVtGftdyiga-LU',
  },
}));

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
});

const ProtectedRoute = ({ component, ...rest }) => (
  <Route
    {...rest}
    render={({ location }) => (sessionStorage.getItem('Authorization') ? (
      <BasicLayout component={component} />
    ) : (
      <Redirect
        to={{
          pathname: '/user',
          state: { from: location },
        }}
      />
    ))}
  />
);

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ApolloProvider client={client}>
        <Router>
          <Route path="/user" exact component={User} />
          <Route path="/modalview" exact component={ModalView} />
          <ProtectedRoute path="/" exact component={Workplace} />
          <ProtectedRoute path="/account/center" component={AccountCenter} />
          <ProtectedRoute path="/account/settings" component={AccountSettings} />
          <ProtectedRoute path="/video" component={VideoBullets} />
        </Router>
      </ApolloProvider>
    </PersistGate>
  </Provider>
);

export default App;
