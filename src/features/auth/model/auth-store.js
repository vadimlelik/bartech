import { create } from 'zustand';

async function parseErrorMessage(response) {
  try {
    const data = await response.json();
    return data.error || `HTTP ${response.status}`;
  } catch {
    return `HTTP ${response.status}`;
  }
}

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  _loading: false,
  loading: false,
  initialized: false,

  init: () => {
    const state = get();
    if (!state.initialized && typeof window !== 'undefined') {
      set({ initialized: true, _loading: true, loading: true });
      get()
        .refreshSession()
        .finally(() => {
          set({ _loading: false, loading: false });
        });
    }
  },

  cleanup: () => {},

  refreshSession: async () => {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        set((s) => ({
          user: null,
          profile: null,
          loading: s._loading,
        }));
        return;
      }

      const { user, profile } = await response.json();
      set((s) => ({
        user: user || null,
        profile: profile || null,
        loading: s._loading,
      }));
    } catch {
      set((s) => ({
        user: null,
        profile: null,
        loading: s._loading,
      }));
    }
  },

  fetchProfile: async () => {
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          set((s) => ({ profile: null, loading: s._loading }));
        }
        return;
      }

      const { profile: data } = await response.json();
      set((s) => ({
        profile: data || null,
        loading: s._loading,
      }));
    } catch {
      set((s) => ({ profile: null, loading: s._loading }));
    }
  },

  signUp: async (email, password, fullName = '') => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
          fullName,
        }),
      });

      if (!response.ok) {
        const message = await parseErrorMessage(response);
        return { data: null, error: new Error(message) };
      }

      const { user, profile } = await response.json();
      set((s) => ({
        user: user || null,
        profile: profile || null,
        loading: s._loading,
      }));

      return { data: { user, profile }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  signIn: async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const message = await parseErrorMessage(response);
        return { data: null, error: new Error(message) };
      }

      const { user, profile } = await response.json();
      set((s) => ({
        user: user || null,
        profile: profile || null,
        loading: s._loading,
      }));

      return { data: { user, profile }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  signOut: async (router) => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      /* ignore */
    }

    set((s) => ({
      user: null,
      profile: null,
      _loading: false,
      loading: false,
    }));

    if (router) {
      router.push('/');
    } else if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  },

  isAdmin: () => {
    const { profile } = get();
    return profile?.role === 'admin';
  },
}));
