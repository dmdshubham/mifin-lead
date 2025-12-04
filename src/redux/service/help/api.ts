import { prefixBaseUrl } from "@mifin/utils/addBaseUrl";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "@mifin/service/service-api";
import { MifinHttpClient } from "@mifin/service/service-axios";

//const HELP_URL = prefixBaseUrl("/contact/help.do");

export const help = createAsyncThunk<Array<any>, Array<any>>(
  "help",
  async (body, { rejectWithValue }) => {
    try {
      const response = await MifinHttpClient.post(api.help, body);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.message);
      }
      throw err;
    }
  }
);
