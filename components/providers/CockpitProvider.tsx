'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface DataStore {
  decisions: any[];
  risks: any[];
  reports: any[];
  projects: any[];
  methodologies: any[];
  connectors: any[];
}

interface CockpitContextType {
  store: DataStore;
  addItem: (collection: keyof DataStore, item: any) => void;
  updateItem: (collection: keyof DataStore, id: string, updates: any) => void;
  deleteItem: (collection: keyof DataStore, id: string) => void;
  getItems: (collection: keyof DataStore) => any[];
  refreshCount: number; // Ajout d'un counter pour forcer les re-renders
}

const CockpitContext = createContext<CockpitContextType | undefined>(undefined);

const STORAGE_KEY = 'powalyze_cockpit_data';

const initialStore: DataStore = {
  decisions: [],
  risks: [],
  reports: [],
  projects: [],
  methodologies: [],
  connectors: []
};

export function CockpitProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<DataStore>(initialStore);
  const [refreshCount, setRefreshCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount (une seule fois)
  useEffect(() => {
    if (!isLoaded) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsedData = JSON.parse(stored);
          setStore(parsedData);
          console.log('✅ Données chargées depuis localStorage:', parsedData);
        } catch (err) {
          console.error('❌ Error loading cockpit data:', err);
        }
      }
      setIsLoaded(true);
    }
  }, [isLoaded]);

  // Save to localStorage on change (sauf au premier chargement)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
      console.log('💾 Données sauvegardées dans localStorage:', store);
    }
  }, [store, isLoaded]);

  const addItem = (collection: keyof DataStore, item: any) => {
    const newItem = {
      ...item,
      id: item.id || Date.now().toString(),
      created_at: item.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setStore(prev => {
      const newStore = {
        ...prev,
        [collection]: [newItem, ...prev[collection]]
      };
      return newStore;
    });
    setRefreshCount(c => c + 1); // Force re-render
    console.log(`➕ Item ajouté à ${collection}:`, newItem);
  };

  const updateItem = (collection: keyof DataStore, id: string, updates: any) => {
    setStore(prev => {
      const newStore = {
        ...prev,
        [collection]: prev[collection].map(item =>
          item.id === id
            ? { ...item, ...updates, updated_at: new Date().toISOString() }
            : item
        )
      };
      return newStore;
    });
    setRefreshCount(c => c + 1); // Force re-render
    console.log(`✏️ Item mis à jour dans ${collection}:`, id, updates);
  };

  const deleteItem = (collection: keyof DataStore, id: string) => {
    setStore(prev => {
      const newStore = {
        ...prev,
        [collection]: prev[collection].filter(item => item.id !== id)
      };
      return newStore;
    });
    setRefreshCount(c => c + 1); // Force re-render
    console.log(`🗑️ Item supprimé de ${collection}:`, id);
  };

  const getItems = (collection: keyof DataStore) => {
    return store[collection] || [];
  };

  return (
    <CockpitContext.Provider value={{ store, addItem, updateItem, deleteItem, getItems, refreshCount }}>
      {children}
    </CockpitContext.Provider>
  );
}

export function useCockpit() {
  const context = useContext(CockpitContext);
  if (!context) {
    throw new Error('useCockpit must be used within CockpitProvider');
  }
  return context;
}
