import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import authReducer from './authslice';
// import thunk from 'redux-thunk';

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
  },
});

export default store;
