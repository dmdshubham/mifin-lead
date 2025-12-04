import { prefixBaseUrl } from "@mifin/utils/addBaseUrl";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "@mifin/service/service-api";
import { MifinHttpClient } from "@mifin/service/service-axios";

// const GET_NOTIFICATION_DETAILS_URL = prefixBaseUrl(
//   "/notification/getNotififactionDetails.do"
// );

export const getNotificationDetails = createAsyncThunk<Array<any>, Array<any>>(
  "getNotificationDetails",
  async (body, { rejectWithValue }) => {
    try {
      const response = await MifinHttpClient.post(api.getNotififactionDetails, body);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.message);
      }
      throw err;
    }
  }
);
