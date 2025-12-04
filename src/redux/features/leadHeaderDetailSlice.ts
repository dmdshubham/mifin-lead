import { createSlice } from "@reduxjs/toolkit";

const leadHeaderDetailsInitialState = {
  data: {}
};

const leadHeaderDetailsSlice = createSlice({
    name:"leadHeaderDetails", 
    initialState:leadHeaderDetailsInitialState,
    reducers: {
        updateLeadHeaderDetails: (state, action) => {
            state.data = action.payload
        }
    }
})

export const { updateLeadHeaderDetails } = leadHeaderDetailsSlice.actions;
export default leadHeaderDetailsSlice.reducer;


