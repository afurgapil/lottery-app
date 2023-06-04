import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lottery: null,
};

export const contractsSlice = createSlice({
  name: "contracts",
  initialState,
  reducers: {
    setLotteryContract: (state, action) => {
      state.lottery = action.payload;
    },
  },
});

export const { setLotteryContract } = contractsSlice.actions;

export default contractsSlice.reducer;
