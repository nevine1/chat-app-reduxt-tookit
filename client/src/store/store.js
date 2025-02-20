
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // default is localStorage
import authReducer from './slices/auth/authSlice'; // Your reducer

const persistConfig = {
  key: 'root',
  storage, // or sessionStorage
  whitelist: ['auth'] // Add only the slices you want to persist
};

const rootReducer = combineReducers({
  auth: authReducer,
})
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
});

export const persistor  = persistStore(store);

