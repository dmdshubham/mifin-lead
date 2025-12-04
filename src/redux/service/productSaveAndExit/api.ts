import { prefixBaseUrl } from "@mifin/utils/addBaseUrl";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "@mifin/service/service-api";
import { MifinHttpClient } from "@mifin/service/service-axios";

// const PRODUCT_SAVE_AND_EXIT_URL = prefixBaseUrl(
//   "/product/productSaveAndExit.do"
// );

export const productSaveandExit = createAsyncThunk<Array<any>, Array<any>>(
  "productSaveandExit",
  async (body, { rejectWithValue }) => {
    try {
      const response = await MifinHttpClient.post(api.saveProduct, body);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.message);
      }
      throw err;
    }
  }
);
