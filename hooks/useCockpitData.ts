'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

const STORAGE_PREFIX = 'powalyze_demo_';

export function useCockpitData<T>(
  key: string,
  initialData: T[],
  supabaseTable?: string
) {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(true);
  const [useSupabase, setUseSupabase] = useState(false);

  useEffect(() => {
    const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    setUseSupabase(hasSupabase);

    async function loadData() {
      if (hasSupabase && supabaseTable) {
        try {
          const supabase = createClient();
          const { data: supabaseData, error } = await supabase
            .from(supabaseTable)
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && supabaseData) {
            setData(supabaseData as T[]);
          } else {
            // Fallback to localStorage
            const stored = localStorage.getItem(STORAGE_PREFIX + key);
            setData(stored ? JSON.parse(stored) : initialData);
          }
        } catch (err) {
          // Fallback to localStorage
          const stored = localStorage.getItem(STORAGE_PREFIX + key);
          setData(stored ? JSON.parse(stored) : initialData);
        }
      } else {
        // Use localStorage only
        const stored = localStorage.getItem(STORAGE_PREFIX + key);
        setData(stored ? JSON.parse(stored) : initialData);
      }
      setLoading(false);
    }

    loadData();
  }, [key, supabaseTable]);

  const saveToStorage = (newData: T[]) => {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(newData));
  };

  const create = async (item: Partial<T>): Promise<T> => {
    const newItem = {
      ...item,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as T;

    if (useSupabase && supabaseTable) {
      try {
        const supabase = createClient();
        const { data: inserted, error } = await supabase
          .from(supabaseTable)
          .insert([item])
          .select()
          .single();

        if (!error && inserted) {
          const updatedData = [inserted as T, ...data];
          setData(updatedData);
          saveToStorage(updatedData);
          return inserted as T;
        }
      } catch (err) {
        console.error('Supabase error, using localStorage:', err);
      }
    }

    // Fallback or localStorage-only mode
    const updatedData = [newItem, ...data];
    setData(updatedData);
    saveToStorage(updatedData);
    return newItem;
  };

  const update = async (id: string, updates: Partial<T>): Promise<void> => {
    if (useSupabase && supabaseTable) {
      try {
        const supabase = createClient();
        const { error } = await supabase
          .from(supabaseTable)
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id);

        if (!error) {
          const updatedData = data.map(item =>
            (item as any).id === id ? { ...item, ...updates } : item
          );
          setData(updatedData);
          saveToStorage(updatedData);
          return;
        }
      } catch (err) {
        console.error('Supabase error, using localStorage:', err);
      }
    }

    // Fallback or localStorage-only mode
    const updatedData = data.map(item =>
      (item as any).id === id ? { ...item, ...updates, updated_at: new Date().toISOString() } : item
    );
    setData(updatedData);
    saveToStorage(updatedData);
  };

  const remove = async (id: string): Promise<void> => {
    if (useSupabase && supabaseTable) {
      try {
        const supabase = createClient();
        const { error } = await supabase
          .from(supabaseTable)
          .delete()
          .eq('id', id);

        if (!error) {
          const updatedData = data.filter(item => (item as any).id !== id);
          setData(updatedData);
          saveToStorage(updatedData);
          return;
        }
      } catch (err) {
        console.error('Supabase error, using localStorage:', err);
      }
    }

    // Fallback or localStorage-only mode
    const updatedData = data.filter(item => (item as any).id !== id);
    setData(updatedData);
    saveToStorage(updatedData);
  };

  return {
    data,
    loading,
    create,
    update,
    remove,
    setData,
    useSupabase
  };
}
