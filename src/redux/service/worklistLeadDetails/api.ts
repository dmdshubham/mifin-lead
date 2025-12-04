import { prefixBaseUrl } from "@mifin/utils/addBaseUrl";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "@mifin/service/service-api";
import { MifinHttpClient } from "@mifin/service/service-axios";
import { saveMasterData, getMasterData } from "@mifin/utils/indexedDB";

//const WORKLIST_LEAD_DETAILS_URL = prefixBaseUrl("/common/getMasters.do");

export const fetchLeadDetails = createAsyncThunk<Array<any>, Array<any>>(
  "worklistLeadDetails/fetchLeadDetails",
  async (body, { rejectWithValue }) => {
    try {
      // Try to fetch from API if online
      if (navigator.onLine) {
        const response = await MifinHttpClient.post(api.getMasterList, body);
        
        // Cache the master data for offline use
        if (response.data) {
          saveMasterData('getMasters', response.data).catch(err => {
            console.error('Error caching master data:', err);
          });
        }
        
        return response.data;
      } else {
        // Load from cache when offline
        console.log('Offline: Loading master data from cache');
        const cachedData = await getMasterData('getMasters');
        
        if (cachedData) {
          return cachedData;
        } else {
          return rejectWithValue('No cached master data available');
        }
      }
    } catch (err) {
      // If online fetch fails, try to return cached data
      console.log('Master data fetch failed, trying cache...');
      try {
        const cachedData = await getMasterData('getMasters');
        if (cachedData) {
          console.log('Returning cached master data after fetch failure');
          return cachedData;
        }
      } catch (cacheErr) {
        console.error('Error loading cached master data:', cacheErr);
      }
      
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.message);
      }
      throw err;
    }
  }
);
