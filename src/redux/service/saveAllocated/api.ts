import { prefixBaseUrl } from "@mifin/utils/addBaseUrl";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "@mifin/service/service-api";
import { MifinHttpClient } from "@mifin/service/service-axios";

// const SAVE_ALLOCATED_LEAD_URL = prefixBaseUrl(
//   "//worklist1/saveAllocatedLead.do"
// );

export const saveAllocated = createAsyncThunk<Array<any>, Array<any>>(
  "saveAllocated",
  async (body, { rejectWithValue }) => {
    try {
      const response = await MifinHttpClient.post(api.reallocation, body);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.message);
      }
      throw err;
    }
  }
);
