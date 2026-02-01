/**
 * 🔥 STORE UNIQUE ZUSTAND - Ne jamais créer de store dans un composant
 * 
 * Import : import { useAppStore } from '@/stores/appStore'
 */

import { create } from 'zustand';

export interface DataStore {
  decisions: any[];
  risks: any[];
  reports: any[];
  projects: any[];
  methodologies: any[];
  connectors: any[];
}

export interface UserData {
  id?: string;
  email?: string;
  name?: string;
  organization_id?: string;
  [key: string]: any;
}

interface AppStore {
  // Data store
  store: DataStore;
  isInitialized: boolean;
  
  // User data
  userData: UserData | null;
  
  // Actions for store
  setStore: (data: DataStore) => void;
  addItem: (collection: keyof DataStore, item: any) => void;
  updateItem: (collection: keyof DataStore, id: string, updates: any) => void;
  deleteItem: (collection: keyof DataStore, id: string) => void;
  getItems: (collection: keyof DataStore) => any[];
  
  // Actions for user data
  setUserData: (data: UserData | null) => void;
  
  // Reset
  reset: () => void;
}

const initialStore: DataStore = {
  decisions: [],
  risks: [],
  reports: [],
  projects: [],
  methodologies: [],
  connectors: []
};

/**
 * ✅ Store unique de l'application
 * Créé UNE SEULE FOIS au niveau module
 */
export const useAppStore = create<AppStore>((set, get) => ({
  store: initialStore,
  isInitialized: false,
  userData: null,

  setStore: (data: DataStore) => 
    set({ store: data, isInitialized: true }),

  addItem: (collection: keyof DataStore, item: any) => {
    const currentStore = get().store;
    const newItem = {
      ...item,
      id: item.id || Date.now().toString(),
      created_at: item.created_at || new Date().toISOString(),
    };

    set({
      store: {
        ...currentStore,
        [collection]: [newItem, ...currentStore[collection]]
      }
    });
  },

  updateItem: (collection: keyof DataStore, id: string, updates: any) => {
    const currentStore = get().store;
    const updated = currentStore[collection].map((item: any) =>
      item.id === id ? { ...item, ...updates, updated_at: new Date().toISOString() } : item
    );

    set({
      store: {
        ...currentStore,
        [collection]: updated
      }
    });
  },

  deleteItem: (collection: keyof DataStore, id: string) => {
    const currentStore = get().store;
    const filtered = currentStore[collection].filter((item: any) => item.id !== id);

    set({
      store: {
        ...currentStore,
        [collection]: filtered
      }
    });
  },

  getItems: (collection: keyof DataStore) => {
    return get().store[collection];
  },

  setUserData: (data: UserData | null) => {
    set({ userData: data });
  },

  reset: () => set({ 
    store: initialStore, 
    isInitialized: false,
    userData: null 
  })
}));
