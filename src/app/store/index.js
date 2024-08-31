// ./src/app/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import { localStorageMiddleware } from './middleware';

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(localStorageMiddleware),
});

export default store;
