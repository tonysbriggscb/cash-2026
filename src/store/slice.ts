import { createSlice } from "@reduxjs/toolkit";

export interface SliceState {
  theme: "light" | "dark";
}

const initialState: SliceState = {
  theme: "light",
};

export const slice = createSlice({
  name: "slice",
  initialState: initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const { setTheme } = slice.actions;

export default slice.reducer;
