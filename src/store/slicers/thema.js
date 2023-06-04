import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  thema: "null",
};

export const themaSlice = createSlice({
  name: "thema",
  initialState,
  reducers: {
    setThema: (state, action) => {
      state.thema = action.payload;
    },
  },
});

export const { setThema } = themaSlice.actions;

export default themaSlice.reducer;
