// store.js
import { configureStore } from '@reduxjs/toolkit';
import videocall from './reducer/index'; // adjust path as needed

const store = configureStore({
  reducer: {
    videocall,
  },
});

export default store;
