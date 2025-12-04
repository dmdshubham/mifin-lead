import { createSlice } from "@reduxjs/toolkit";
import { saveEscalatedLead } from "@mifin/redux/service/saveEscalatedLead/api";
import { INITIAL_STATE } from "@mifin/redux/hook/useInitialState";

const saveEscalatedLeadSlice = createSlice({
  name: "saveEsclatedLead",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(saveEscalatedLead.pending, (state: any) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(saveEscalatedLead.fulfilled, (state: any, action) => {
        state.isLoading = false;
        state.data = action.payload.responseData;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(saveEscalatedLead.rejected, (state: any, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      });
  },
});

export default saveEscalatedLeadSlice.reducer;
