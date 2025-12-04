import { createSlice } from "@reduxjs/toolkit";

const setAgeState = {
  age:""
};

const setAge = createSlice({
  name: "setAge",
  initialState: setAgeState,
  reducers: {
    updateCustomerAge: (state, action) => {
      state.age = action.payload.age;
    },
  },
});

export const { updateCustomerAge } = setAge.actions;

export default setAge.reducer;
