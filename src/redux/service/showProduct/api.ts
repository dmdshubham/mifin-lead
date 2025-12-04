import { prefixBaseUrl } from "@mifin/utils/addBaseUrl";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "@mifin/service/service-api";
import { MifinHttpClient } from "@mifin/service/service-axios";

//const SHOW_CUSTOMER_URL = prefixBaseUrl("/customer/showCustomer.do");

export const showProduct = createAsyncThunk<Array<any>, Array<any>>(
  "showProduct",
  async (body, { rejectWithValue }) => {
    try {
      const response = await MifinHttpClient.post(api.customerDetails, body);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.message);
      }
      throw err;
    }
  }
);
