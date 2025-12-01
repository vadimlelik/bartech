import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function validateSupabaseUrl(url) {
  if (!url) return { valid: false, error: 'URL is missing' };
  
  try {
    const urlObj = new URL(url);
    
    if (urlObj.protocol !== 'https:') {
      return { valid: false, error: 'URL must use HTTPS protocol' };
    }
    
    if (!urlObj.hostname.endsWith('.supabase.co')) {
      return { 
        valid: false, 
        error: `Invalid Supabase URL format. Expected domain ending with .supabase.co, got: ${urlObj.hostname}` 
      };
    }
    
    return { valid: true };
  } catch (error) {
    return { valid: false, error: `Invalid URL format: ${error.message}` };
  }
}

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = 'Missing Supabase environment variables. Please check your .env.local file.';
  console.error(errorMsg, {
    hasUrl: !!supabaseUrl,
    hasAnonKey: !!supabaseAnonKey,
    urlPreview: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'missing',
  });
  
  if (process.env.NODE_ENV === 'development') {
    throw new Error(errorMsg);
  }
} else {
  const urlValidation = validateSupabaseUrl(supabaseUrl);
  if (!urlValidation.valid) {
    console.error('Invalid Supabase URL:', urlValidation.error);
    console.error('Current URL:', supabaseUrl);
    console.error('\n⚠️  ПРОВЕРЬТЕ ВАШ .env.local ФАЙЛ!');
    console.error('URL должен быть в формате: https://xxxxx.supabase.co');
    console.error('Получите правильный URL в Supabase Dashboard: Settings → API → Project URL\n');
    
    if (process.env.NODE_ENV === 'development') {
      throw new Error(`Invalid Supabase URL: ${urlValidation.error}`);
    }
  }
}

const adminKey = supabaseServiceRoleKey || supabaseAnonKey;

let supabase, supabaseAdmin;

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    });

    supabaseAdmin = createClient(supabaseUrl, adminKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  } else {
    console.warn('Supabase not configured. Using fallback clients.');
    supabase = null;
    supabaseAdmin = null;
  }
} catch (error) {
  console.error('Error initializing Supabase clients:', error);
  supabase = null;
  supabaseAdmin = null;
}

export { supabase, supabaseAdmin };

