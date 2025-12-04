import { createSlice } from "@reduxjs/toolkit";
import { getPincodeByTehsil } from "@mifin/redux/service/getPincodeByTehsil/api";
import { INITIAL_STATE } from "@mifin/redux/hook/useInitialState";

const getPincodeByTehsilSlice = createSlice({
  name: "getPincodeByTehsil",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getPincodeByTehsil.pending, (state: any) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(getPincodeByTehsil.fulfilled, (state: any, action) => {
        state.isLoading = false;
        state.data = action.payload.responseData;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(getPincodeByTehsil.rejected, (state: any, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      });
  },
});

export default getPincodeByTehsilSlice.reducer;
