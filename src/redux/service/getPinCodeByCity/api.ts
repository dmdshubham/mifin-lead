import { prefixBaseUrl } from "@mifin/utils/addBaseUrl";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "@mifin/service/service-api";
import { MifinHttpClient } from "@mifin/service/service-axios";

//const GET_CITY_BY_STATE_URL = prefixBaseUrl("/newLead/getCitiesByState.do");

export const getPincodeByCity = createAsyncThunk<Array<any>, Array<any>>(
  "getPincodeByCity",
  async (body, { rejectWithValue }) => {
    try {
      const response = await MifinHttpClient.post(api.getCitiesByState, body);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.message);
      }
      throw err;
    }
  }
);
