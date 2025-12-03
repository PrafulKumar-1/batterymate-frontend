import { createSlice } from '@reduxjs/toolkit';

const configSlice = createSlice({
  name: 'config',
  initialState: {},
  reducers: {
    setConfig: (state, action) => {
      return action.payload;
    },
  },
});

export const { setConfig } = configSlice.actions;
export default configSlice.reducer;