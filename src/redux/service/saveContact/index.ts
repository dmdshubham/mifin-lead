import { createSlice } from "@reduxjs/toolkit";
import { saveContact } from "@mifin/redux/service/saveContact/api";
import { INITIAL_STATE } from "@mifin/redux/hook/useInitialState";

const saveContactSlice = createSlice({
  name: "saveContact",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(saveContact.pending, (state: any) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(saveContact.fulfilled, (state: any, action) => {
        state.isLoading = false;
        state.data = action.payload.responseData;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(saveContact.rejected, (state: any, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      });
  },
});

export default saveContactSlice.reducer;
