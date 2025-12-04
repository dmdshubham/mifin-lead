import { prefixBaseUrl } from "@mifin/utils/addBaseUrl";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "@mifin/service/service-api";
import { MifinHttpClient } from "@mifin/service/service-axios";

//const LEAD_ESCALATAION_URL = prefixBaseUrl("/contact/leadEscalation.do");

export const leadEscalation = createAsyncThunk<Array<any>, Array<any>>(
  "leadEscalation",
  async (body, { rejectWithValue }) => {
    try {
      const response = await MifinHttpClient.post(api.leadEscalation, body);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.message);
      }
      throw err;
    }
  }
);
