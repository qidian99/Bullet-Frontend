import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { withClientState } from 'apollo-link-state';
import { ApolloLink, Observable, split } from 'apollo-link';

import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
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

// Create an http link:
const httpLink = new HttpLink({
  uri: 'https://tritonbyte-server.herokuapp.com/graphql',
  credentials: 'same-origin',
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: 'wss://tritonbyte-server.herokuapp.com/graphql',
  options: {
    reconnect: true,
    connectionParams: {
      authToken: sessionStorage.getItem('authToken'),
      refreshToken: sessionStorage.getItem('refreshToken'),
    },
  },
});

const afterwareLink = new ApolloLink((operation, forward) => forward(operation).map((response) => {
  const { response: { headers } } = operation.getContext();

  if (headers) {
    const refreshToken = headers.get('refreshToken');
    const authToken = headers.get('authToken');

    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    if (authToken) {
      localStorage.setItem('authToken', authToken);
    }
  }

  return response;
}));

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition'
      && definition.operation === 'subscription'
    );
  },
  wsLink,
  afterwareLink.concat(httpLink),
);

const cache = new InMemoryCache({
  dataIdFromObject: (object) => object[`${object.__typename.toLowerCase()}Id`],
});

const request = async (operation) => {
  const authToken = sessionStorage.getItem('authToken');
  const refreshToken = sessionStorage.getItem('refreshToken');
  if (authToken && refreshToken) {
    operation.setContext({
      headers: {
        authToken,
        refreshToken,
      },
    });
  }
};

const requestLink = new ApolloLink((operation, forward) => new Observable((observer) => {
  let handle;
  Promise.resolve(operation)
    .then((oper) => request(oper))
    .then(() => {
      handle = forward(operation).subscribe({
        next: observer.next.bind(observer),
        error: observer.error.bind(observer),
        complete: observer.complete.bind(observer),
      });
    })
    .catch(observer.error.bind(observer));

  return () => {
    if (handle) handle.unsubscribe();
  };
}));

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) => console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        ));
      }
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    requestLink,
    withClientState({
      defaults: {
        isConnected: true,
      },
      resolvers: {
        Mutation: {
          updateNetworkStatus: (_, { isConnected }, { cache: localCache }) => {
            localCache.writeData({ data: { isConnected } });
            return null;
          },
        },
      },
      cache,
    }),
    link,
  ]),
  cache,
});

const ProtectedRoute = ({ component, ...rest }) => (
  <Route
    {...rest}
    render={({ location }) => (sessionStorage.getItem('authToken') ? (
      <BasicLayout component={component} />
    ) : (
      <Redirect
        to={{
          pathname: '/user/login',
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
          <Route path="/user" component={User} />
          <ProtectedRoute path="/" exact component={Workplace} />
          <ProtectedRoute path="/account/center" component={AccountCenter} />
          <ProtectedRoute path="/account/settings" component={AccountSettings} />
        </Router>
      </ApolloProvider>
    </PersistGate>
  </Provider>
);

export default App;
