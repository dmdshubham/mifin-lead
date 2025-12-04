import { createSlice } from "@reduxjs/toolkit";
import { saveCustomer } from "@mifin/redux/service/saveCustomer/api";
import { INITIAL_STATE } from "@mifin/redux/hook/useInitialState";

const saveCustomerSlice = createSlice({
  name: "saveCustomer",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(saveCustomer.pending, (state: any) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(saveCustomer.fulfilled, (state: any, action) => {
        state.isLoading = false;
        state.data = action.payload.responseData;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(saveCustomer.rejected, (state: any, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      });
  },
});

export default saveCustomerSlice.reducer;
