import { prefixBaseUrl } from "@mifin/utils/addBaseUrl";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "@mifin/service/service-api";
import { MifinHttpClient } from "@mifin/service/service-axios";

//const NEXT_PREV_LEAD_URL = prefixBaseUrl("/newLead/previousNextLead.do");

export const getNextPrevLead = createAsyncThunk<Array<any>, Array<any>>(
  "nextPrevLead",
  async (body, { rejectWithValue }) => {
    try {
      const response = await MifinHttpClient.post(api.nextPrevLead, body);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.message);
      }
      throw err;
    }
  }
);
