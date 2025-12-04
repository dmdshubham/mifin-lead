import { MifinHttpClient } from "@mifin/service/service-axios";
import { prefixBaseUrl } from "@mifin/utils/addBaseUrl";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "@mifin/service/service-api";

//const SAVE_ESCALATED_LEAD_URL = prefixBaseUrl("/contact/leadEscalation.do");

export const saveEscalatedLead = createAsyncThunk<Array<any>, Array<any>>(
  "saveEscalatedLead",
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
