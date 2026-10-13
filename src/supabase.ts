/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && (process.env?.VITE_SUPABASE_URL || process.env?.SUPABASE_URL)) ||
  '';

const supabaseKey = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && (process.env?.VITE_SUPABASE_ANON_KEY || process.env?.SUPABASE_ANON_KEY)) ||
  '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export async function testSupabaseConnection(): Promise<{ success: boolean; message: string; data?: any }> {
  if (!supabase) {
    return {
      success: false,
      message: 'Supabase credentials (SUPABASE_URL / SUPABASE_ANON_KEY) are not yet configured.'
    };
  }

  try {
    const { data, error } = await supabase.from('students').select('*').limit(1);
    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Connected to Supabase database successfully!', data };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Error reaching Supabase database' };
  }
}
