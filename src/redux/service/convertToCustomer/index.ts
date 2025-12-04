import { createSlice } from "@reduxjs/toolkit";
import { convertToCustomer } from "@mifin/redux/service/convertToCustomer/api";
import { INITIAL_STATE } from "@mifin/redux/hook/useInitialState";


export const convertToCustomerSlice = createSlice({
  name: "convertToCustomer",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(convertToCustomer.pending, state => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(convertToCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.isError = null;
      })
      .addCase(convertToCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.error.message || "An error occurred";
      });
  },
});

export default convertToCustomerSlice.reducer;
