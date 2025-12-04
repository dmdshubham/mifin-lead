import { MifinHttpClient } from "@mifin/service/service-axios";
import { prefixBaseUrl } from "@mifin/utils/addBaseUrl";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "@mifin/service/service-api";

//const convertToCustomerURL = prefixBaseUrl(`/product/convertToCustomer.do`);

export const convertToCustomer = createAsyncThunk<Array<any>, Array<any>>(
  "convertToCustomer",
  async (body, { rejectWithValue }) => {
    try {
      const response = await MifinHttpClient.post(api.convertToCustomer, body);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.message);
      }
      throw err;
    }
  }
);
