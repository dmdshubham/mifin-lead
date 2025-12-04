import { prefixBaseUrl } from "@mifin/utils/addBaseUrl";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "@mifin/service/service-api";
import { MifinHttpClient } from "@mifin/service/service-axios";

//const SHOW_CONTACT_URL = prefixBaseUrl("/contact/leadEscalation.do");
//const SHOW_CONTACT_URL = prefixBaseUrl("/contact/showcontact.do");

export const showContact = createAsyncThunk<Array<any>, Array<any>>(
  "showContact",
  async (body, { rejectWithValue }) => {
    try {
      const response = await MifinHttpClient.post(api.contactDetail, body);
      return response.data;
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.message);
      }
      throw err;
    }
  }
);
