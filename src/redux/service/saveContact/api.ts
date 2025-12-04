import { prefixBaseUrl } from "@mifin/utils/addBaseUrl";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "@mifin/service/service-api";
import { MifinHttpClient } from "@mifin/service/service-axios";

//const SAVE_CONTACT_URL = prefixBaseUrl("/contact/saveContact.do");

export const saveContact = createAsyncThunk<Array<any>, Array<any>>(
  "saveContact",
  async (body, { rejectWithValue }) => {
    try {
      const response = await MifinHttpClient.post(api.contactRecord, body);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.message);
      }
      throw err;
    }
  }
);
