/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// db.js - Supabase Database Client for Hostinger Deployment
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

// Initialize Supabase Client
const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-anon-key');

/**
 * Replaces 'your_table' with 'students' as instructed by Hostinger
 */
async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .limit(1);

    if (error) {
      console.log('Supabase connection status:', error.message);
      return { success: false, error };
    }
    console.log('Supabase connected successfully');
    return { success: true, data };
  } catch (err) {
    console.log('Supabase connection note:', err.message);
    return { success: false, error: err };
  }
}

export { createClient, supabase, testConnection };
export default supabase;
