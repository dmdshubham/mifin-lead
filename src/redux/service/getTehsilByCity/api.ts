import { prefixBaseUrl } from "@mifin/utils/addBaseUrl";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { MifinHttpClient } from "@mifin/service/service-axios";
import { api } from "@mifin/service/service-api";

//const GET_TEHSIL_BY_CITY_URL = prefixBaseUrl("/newLead/getTehsilByCity.do");

export const getTehsilByCity = createAsyncThunk<Array<any>, Array<any>>(
  "getTehsilByCity",
  async (body, { rejectWithValue }) => {
    try {
      const response = await MifinHttpClient.post(api.getNewTehsilByCity, body);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.message);
      }
      throw err;
    }
  }
);
