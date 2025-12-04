import { createSlice } from "@reduxjs/toolkit";
import { getPincodeByCity } from "@mifin/redux/service/getPinCodeByCity/api";
import { INITIAL_STATE } from "@mifin/redux/hook/useInitialState";

const getPincodeByCitySlice = createSlice({
  name: "getPincodeByCity",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getPincodeByCity.pending, (state: any) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(getPincodeByCity.fulfilled, (state: any, action) => {
        state.isLoading = false;
        state.data = action.payload.responseData;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(getPincodeByCity.rejected, (state: any, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      });
  },
});

export default getPincodeByCitySlice.reducer;
