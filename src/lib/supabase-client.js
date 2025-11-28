'use client';

import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Клиент для использования на клиенте с поддержкой сессий и cookies
// createBrowserClient автоматически использует cookies для хранения сессии
let supabaseClient = null;

export const createClientSupabase = () => {
  // Создаем клиент только один раз и только на клиенте
  if (typeof window === 'undefined') {
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return document.cookie.split('; ').map(cookie => {
            const [name, ...rest] = cookie.split('=');
            return { name, value: decodeURIComponent(rest.join('=')) };
          });
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            let cookie = `${name}=${encodeURIComponent(value)}`;
            if (options?.maxAge) cookie += `; max-age=${options.maxAge}`;
            if (options?.path) cookie += `; path=${options.path || '/'}`;
            if (options?.domain) cookie += `; domain=${options.domain}`;
            if (options?.sameSite) {
              cookie += `; samesite=${options.sameSite}`;
            }
            if (options?.secure) cookie += `; secure`;
            document.cookie = cookie;
          });
        },
      },
    });
  }

  return supabaseClient;
};

