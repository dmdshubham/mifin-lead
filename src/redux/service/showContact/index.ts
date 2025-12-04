import { createSlice } from "@reduxjs/toolkit";
import { showContact } from "@mifin/redux/service/showContact/api";
import { INITIAL_STATE } from "@mifin/redux/hook/useInitialState";

const showContactSlice = createSlice({
  name: "showContact",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(showContact.pending, (state: any) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(showContact.fulfilled, (state: any, action) => {
        state.isLoading = false;
        state.data = action.payload.responseData;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(showContact.rejected, (state: any, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      });
  },
});

export default showContactSlice.reducer;
