import { createSlice } from "@reduxjs/toolkit";
import { getNotificationDetails } from "@mifin/redux/service/getNotificationDetails/api";
import { INITIAL_STATE } from "@mifin/redux/hook/useInitialState";

const getNotificationDetailsSlice = createSlice({
  name: "getNotificationDetails",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getNotificationDetails.pending, (state: any) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(getNotificationDetails.fulfilled, (state: any, action) => {
        state.isLoading = false;
        state.data = action.payload.responseData;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(getNotificationDetails.rejected, (state: any, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      });
  },
});

export default getNotificationDetailsSlice.reducer;
