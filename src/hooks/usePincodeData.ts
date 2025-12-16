import { useState, useEffect, useCallback } from 'react';
import { pincodeDB } from '@mifin/utils/pincodeDB';

interface City {
  cityMasterId: string;
  displayName: string;
  stateId: string;
  stateName: string;
}

interface Pincode {
  pincode: string;
  divisionName: string;
  id: string;
  name: string;
  cityId: string;
  cityName: string;
  stateId: string;
  stateName: string;
}

export const usePincodeData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize database and load data if needed
  useEffect(() => {
    const initializeDB = async () => {
      try {
        setIsLoading(true);
        const isLoaded = await pincodeDB.isDataLoaded();
        
        if (!isLoaded) {
          // Fetch the pincode data from public folder
          const response = await fetch('/pincode.json');
          if (!response.ok) {
            throw new Error('Failed to fetch pincode data');
          }
          const pincodeData = await response.json();
          await pincodeDB.loadPincodeData(pincodeData);
        }
        
        setIsInitialized(true);
      } catch (err) {
        console.error('Error initializing pincode database:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize database');
      } finally {
        setIsLoading(false);
      }
    };

    initializeDB();
  }, []);

  const getCitiesByState = useCallback(async (stateId: string): Promise<City[]> => {
    if (!isInitialized) {
      console.warn('Database not initialized yet');
      return [];
    }
    
    try {
      return await pincodeDB.getCitiesByState(stateId);
    } catch (err) {
      console.error('Error fetching cities:', err);
      return [];
    }
  }, [isInitialized]);

  const getPincodesByCity = useCallback(async (cityId: string): Promise<Pincode[]> => {
    if (!isInitialized) {
      console.warn('Database not initialized yet');
      return [];
    }
    
    try {
      return await pincodeDB.getPincodesByCity(cityId);
    } catch (err) {
      console.error('Error fetching pincodes:', err);
      return [];
    }
  }, [isInitialized]);

  const searchPincode = useCallback(async (code: string) => {
    if (!isInitialized) {
      console.warn('Database not initialized yet');
      return [];
    }
    
    try {
      return await pincodeDB.searchPincode(code);
    } catch (err) {
      console.error('Error searching pincode:', err);
      return [];
    }
  }, [isInitialized]);

  return {
    isLoading,
    isInitialized,
    error,
    getCitiesByState,
    getPincodesByCity,
    searchPincode,
  };
};

