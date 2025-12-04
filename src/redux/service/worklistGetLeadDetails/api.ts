import { prefixBaseUrl } from "@mifin/utils/addBaseUrl";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "@mifin/service/service-api";
import { MifinHttpClient } from "@mifin/service/service-axios";

// const WORKLIST_GET_LEAD_DETAILS_URL = prefixBaseUrl(
//   "/worklist1/getLeadsDetails"
// );

export const getLeadDetails = createAsyncThunk<Array<any>, Array<any>>(
  "worklistLeadDetails/getLeadDetails",
  async (body, { rejectWithValue }) => {
    try {
      const response = await MifinHttpClient.post(api.getLeadList, body);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.message);
      }
      throw err;
    }
  }
);
