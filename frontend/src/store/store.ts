import { configureStore } from '@reduxjs/toolkit';
import studentReducer from './students/studentSlice';

export const store = configureStore({
  reducer: {
    students: studentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;