import { prefixBaseUrl } from "@mifin/utils/addBaseUrl";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "@mifin/service/service-api";
import { MifinHttpClient } from "@mifin/service/service-axios";

//const REFER_CASE_URL = prefixBaseUrl("/contact/referCase.do");

export const referCase = createAsyncThunk<Array<any>, Array<any>>(
  "referCase",
  async (body, { rejectWithValue }) => {
    try {
      const response = await MifinHttpClient.post(api.referCase, body);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.message);
      }
      throw err;
    }
  }
);
