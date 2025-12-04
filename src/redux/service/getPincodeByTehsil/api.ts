import { prefixBaseUrl } from "@mifin/utils/addBaseUrl";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { MifinHttpClient } from "@mifin/service/service-axios";
import { api } from "@mifin/service/service-api";

//const GET_PINCODE_BY_TEHSIL_URL = prefixBaseUrl("/newLead/getPincodeByTehsil.do");

export const getPincodeByTehsil = createAsyncThunk<Array<any>, Array<any>>(
  "getPincodeByTehsil",
  async (body, { rejectWithValue }) => {
    try {
      const response = await MifinHttpClient.post(api.getNewPincodeByTehsil, body);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.message);
      }
      throw err;
    }
  }
);
