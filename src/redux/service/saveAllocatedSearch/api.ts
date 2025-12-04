import { prefixBaseUrl } from "@mifin/utils/addBaseUrl";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "@mifin/service/service-api";
import { MifinHttpClient } from "@mifin/service/service-axios";

// const SAVE_ALLOCATE_SEARCH_URL = prefixBaseUrl(
//   "/searchAndAllocate/saveAllotedcases.do"
// );

export const saveAllocatedSearched = createAsyncThunk<Array<any>, Array<any>>(
  "saveAllocatedSearched",
  async (body, { rejectWithValue }) => {
    try {
      const response = await MifinHttpClient.post(api.saveAllocatedSearched, body);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.message);
      }
      throw err;
    }
  }
);
