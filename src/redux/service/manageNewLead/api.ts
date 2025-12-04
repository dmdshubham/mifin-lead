import { prefixBaseUrl } from "@mifin/utils/addBaseUrl";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "@mifin/service/service-api";
import { MifinHttpClient } from "@mifin/service/service-axios";

//const MANAGE_NEW_LEAD_URL = prefixBaseUrl("/newLead/manageNewLead.do");

export const manageNewLead = createAsyncThunk<Array<any>, Array<any>>(
  "manageNewLead",
  async (body, { rejectWithValue }) => {
    try {
      const response = await MifinHttpClient.post(api.manageNewLead, body);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.message);
      }
      throw err;
    }
  }
);
