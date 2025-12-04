import { createSlice } from "@reduxjs/toolkit";

const contactDataState = {
  data:{}
};

const contactDataSlice = createSlice({
  name: "contactData",
  initialState: contactDataState,
  reducers: {
    updateContactData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { updateContactData } = contactDataSlice.actions;
export default contactDataSlice.reducer;
