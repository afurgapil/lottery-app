import { configureStore } from "@reduxjs/toolkit";
import dataSlice from "./slicers/data";
import contractsSlice from "./slicers/contract";
import themaSlice from "./slicers/thema";
export const store = configureStore({
  reducer: {
    data: dataSlice,
    contracts: contractsSlice,
    thema: themaSlice,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});
