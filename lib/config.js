import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if environment variables are available
if (!supabaseUrl || !supabaseKey) {
  console.warn('NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY not found, using fallback configuration');
}

// Create client with error handling
let supabase;
try {
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client created successfully in config.js');
  } else {
    console.warn('Supabase client not created due to missing environment variables');
    supabase = null;
  }
} catch (error) {
  console.error('Failed to create Supabase client:', error);
  supabase = null;
}

/**
 * Get site configuration
 * @returns {Promise<Object>} Site configuration object
 */
export async function getSiteConfig() {
  // Fallback if Supabase is not available
  if (!supabase) {
    console.warn('Supabase client not available, returning default config');
    return { logo_url: null };
  }

  try {
    const { data, error } = await supabase
      .from('site_config')
      .select('*')
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data || { logo_url: null };
  } catch (error) {
    console.error('Error fetching site config:', error);
    return { logo_url: null };
  }
}

/**
 * Update site configuration
 * @param {Object} config - Configuration object with logo_url
 * @returns {Promise<Object>} Updated configuration
 */
export async function updateSiteConfig(config) {
  // Fallback if Supabase is not available
  if (!supabase) {
    console.warn('Supabase client not available, cannot update config');
    throw new Error('Supabase client not available');
  }

  try {
    const { data, error } = await supabase
      .from('site_config')
      .upsert({
        id: 'default', // Use a fixed ID for single config record
        logo_url: config.logo_url,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error updating site config:', error);
    throw error;
  }
}

/**
 * Get logo URL from site configuration
 * @returns {Promise<string|null>} Logo URL or null if not set
 */
export async function getLogoUrl() {
  const config = await getSiteConfig();
  return config.logo_url;
}