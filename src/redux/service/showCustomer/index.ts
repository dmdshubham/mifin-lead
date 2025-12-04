import { createSlice } from "@reduxjs/toolkit";
import { showCustomer } from "@mifin/redux/service/showCustomer/api";
import { INITIAL_STATE } from "@mifin/redux/hook/useInitialState";

const showCustomerSlice = createSlice({
  name: "showCustomer",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(showCustomer.pending, (state: any) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(showCustomer.fulfilled, (state: any, action) => {
        state.isLoading = false;
        state.data = action.payload.responseData;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(showCustomer.rejected, (state: any, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      });
  },
});

export default showCustomerSlice.reducer;
