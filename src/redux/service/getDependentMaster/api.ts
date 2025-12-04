import { prefixBaseUrl } from "@mifin/utils/addBaseUrl";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "@mifin/service/service-api";
import { MifinHttpClient } from "@mifin/service/service-axios";
import { saveMasterData, getMasterData } from "@mifin/utils/indexedDB";

// const GET_DEPENDENT_MASTER_URL = prefixBaseUrl("/customer/getDependentMaster.do");

export const getDependentMaster = createAsyncThunk<Array<any>, Array<any>>(
  "getDependentMaster",
  async (body, { rejectWithValue }) => {
    try {
      // Try to fetch from API if online
      if (navigator.onLine) {
        const response = await MifinHttpClient.post(api.getDependentMaster, body);
        
        // Cache the dependent master data for offline use
        if (response.data) {
          const cacheKey = `getDependentMaster-${JSON.stringify(body.requestData || {})}`;
          saveMasterData(cacheKey, response.data).catch(err => {
            console.error('Error caching dependent master data:', err);
          });
        }
        
        return response.data;
      } else {
        // Load from cache when offline
        console.log('Offline: Loading dependent master data from cache');
        const cacheKey = `getDependentMaster-${JSON.stringify(body.requestData || {})}`;
        const cachedData = await getMasterData(cacheKey);
        
        if (cachedData) {
          return cachedData;
        } else {
          return rejectWithValue('No cached dependent master data available');
        }
      }
    } catch (err) {
      // If online fetch fails, try to return cached data
      console.log('Dependent master data fetch failed, trying cache...');
      try {
        const cacheKey = `getDependentMaster-${JSON.stringify(body.requestData || {})}`;
        const cachedData = await getMasterData(cacheKey);
        if (cachedData) {
          console.log('Returning cached dependent master data after fetch failure');
          return cachedData;
        }
      } catch (cacheErr) {
        console.error('Error loading cached dependent master data:', cacheErr);
      }
      
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.message);
      }
      throw err;
    }
  }
);
