import { createSlice } from "@reduxjs/toolkit";
import { getTehsilByCity } from "@mifin/redux/service/getTehsilByCity/api";
import { INITIAL_STATE } from "@mifin/redux/hook/useInitialState";

const getTehsilByCitySlice = createSlice({
  name: "getTehsilByCity",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getTehsilByCity.pending, (state: any) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(getTehsilByCity.fulfilled, (state: any, action) => {
        state.isLoading = false;
        state.data = action.payload.responseData;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(getTehsilByCity.rejected, (state: any, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      });
  },
});

export default getTehsilByCitySlice.reducer;
