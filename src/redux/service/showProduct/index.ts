import { createSlice } from "@reduxjs/toolkit";
import { showProduct } from "@mifin/redux/service/showProduct/api";
import { INITIAL_STATE } from "@mifin/redux/hook/useInitialState";

const showProductSlice = createSlice({
  name: "showProduct",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(showProduct.pending, (state: any) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(showProduct.fulfilled, (state: any, action) => {
        state.isLoading = false;
        state.data = action.payload.responseData;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(showProduct.rejected, (state: any, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      });
  },
});

export default showProductSlice.reducer;
