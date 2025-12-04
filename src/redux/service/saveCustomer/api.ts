import { prefixBaseUrl } from "@mifin/utils/addBaseUrl";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "@mifin/service/service-api";
import { MifinHttpClient } from "@mifin/service/service-axios";

//const SHOW_CUSTOMER_URL = prefixBaseUrl("/customer/saveCustomer.do");

export const saveCustomer = createAsyncThunk<Array<any>, Array<any>>(
  "saveCustomer",
  async (body, { rejectWithValue }) => {
    try {
      const response = await MifinHttpClient.post(api.customerRecord, body);
      return response.data;
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.message);
      }
      throw err;
    }
  }
);
