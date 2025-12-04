import { prefixBaseUrl } from "@mifin/utils/addBaseUrl";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "@mifin/service/service-api";
import { MifinHttpClient } from "@mifin/service/service-axios";
//const LEAD_SEARCH_URL = prefixBaseUrl("/newLead/checkLeadAvail.do");

export const leadSearch = createAsyncThunk<Array<any>, Array<any>>(
  "leadSearch",
  async (body, { rejectWithValue }) => {
    try {
      const response = await MifinHttpClient.post(api.leadSearch, body);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.message);
      }
      throw err;
    }
  }
);
