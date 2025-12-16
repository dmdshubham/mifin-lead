import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface PincodeDBSchema extends DBSchema {
  pincodes: {
    key: string;
    value: {
      id: string;
      code: string;
      name: string;
      displayList: string;
      cityFlag: string;
      stateFlag: string;
      cityId: string;
      cityName: string;
      stateId: string;
      stateName: string;
    };
    indexes: { 
      'by-state': string; 
      'by-city': string;
      'by-code': string;
    };
  };
}

const DB_NAME = 'pincodeDB';
const DB_VERSION = 1;
const STORE_NAME = 'pincodes';

class PincodeDatabase {
  private db: IDBPDatabase<PincodeDBSchema> | null = null;
  private initPromise: Promise<void> | null = null;

  async init() {
    if (this.db) return;
    
    if (this.initPromise) {
      await this.initPromise;
      return;
    }

    this.initPromise = this.initDB();
    await this.initPromise;
  }

  private async initDB() {
    this.db = await openDB<PincodeDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('by-state', 'stateId');
          store.createIndex('by-city', 'cityId');
          store.createIndex('by-code', 'code');
        }
      },
    });
  }

  async loadPincodeData(pincodeData: any) {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    const data = pincodeData?.responseData?.[""]?.returnParameter || [];
    
    // Check if data is already loaded
    const count = await this.db.count(STORE_NAME);
    if (count > 0) {
      console.log('Pincode data already loaded');
      return;
    }

    console.log('Loading pincode data into IndexedDB...');
    const tx = this.db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    // Batch insert for better performance
    const batchSize = 1000;
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      await Promise.all(batch.map((item: any) => store.put(item)));
    }

    await tx.done;
    console.log('Pincode data loaded successfully');
  }

  async getCitiesByState(stateId: string) {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    const tx = this.db.transaction(STORE_NAME, 'readonly');
    const index = tx.objectStore(STORE_NAME).index('by-state');
    const items = await index.getAll(stateId);

    // Filter unique cities
    const citiesMap = new Map();
    items.forEach((item) => {
      if (item.cityFlag === 'Y' && !citiesMap.has(item.cityId)) {
        citiesMap.set(item.cityId, {
          cityMasterId: item.cityId,
          displayName: item.cityName,
          stateId: item.stateId,
          stateName: item.stateName,
        });
      }
    });

    return Array.from(citiesMap.values());
  }

  async getPincodesByCity(cityId: string) {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    const tx = this.db.transaction(STORE_NAME, 'readonly');
    const index = tx.objectStore(STORE_NAME).index('by-city');
    const items = await index.getAll(cityId);

    return items.map((item) => ({
      pincode: item.code,
      divisionName: item.displayList,
      id: item.id,
      name: item.name,
      cityId: item.cityId,
      cityName: item.cityName,
      stateId: item.stateId,
      stateName: item.stateName,
    }));
  }

  async searchPincode(code: string) {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    const tx = this.db.transaction(STORE_NAME, 'readonly');
    const index = tx.objectStore(STORE_NAME).index('by-code');
    return await index.getAll(code);
  }

  async isDataLoaded(): Promise<boolean> {
    await this.init();
    if (!this.db) return false;
    const count = await this.db.count(STORE_NAME);
    return count > 0;
  }

  async clearData() {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');
    await this.db.clear(STORE_NAME);
  }
}

export const pincodeDB = new PincodeDatabase();

