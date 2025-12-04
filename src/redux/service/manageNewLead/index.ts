import { createSlice } from "@reduxjs/toolkit";
import { manageNewLead } from "@mifin/redux/service/manageNewLead/api";
import { INITIAL_STATE } from "@mifin/redux/hook/useInitialState";

const manageNewLeadSlice = createSlice({
  name: "manageNewLead",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(manageNewLead.pending, (state: any) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(manageNewLead.fulfilled, (state: any, action) => {
        state.isLoading = false;
        state.data = action.payload.responseData;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(manageNewLead.rejected, (state: any, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      });
  },
});

export default manageNewLeadSlice.reducer;
