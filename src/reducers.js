import { combineReducers, createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const authReducer = (state = {}, action) => {
  switch (action.type) {
    case 'LOGIN_USER':
      return { userId: action.userId };
    default:
      return state;
  }
};

const settingsReducer = (state = {
  collapsed: false,
  navTheme: 'light',
  layout: 'topmenu',
}, action) => {
  switch (action.type) {
    case 'COLLAPSE':
      return {
        ...state,
        collapsed: true,
      };
    case 'EXPAND':
      return {
        ...state,
        collapsed: false,
      };
    default: return state;
  }
};

const rootReducer = combineReducers({
  auth: authReducer,
  settings: settingsReducer,
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer);
const persistor = persistStore(store);
// persistor.purge();
export { store, persistor };
