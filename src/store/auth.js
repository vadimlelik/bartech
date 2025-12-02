import { create } from 'zustand';
import { createClientSupabase } from '@/lib/supabase-client';

let supabaseClient = null;
let authSubscription = null;
let cleanup = null;

const getSupabase = () => {
  if (typeof window === 'undefined') return null;
  if (!supabaseClient) {
    supabaseClient = createClientSupabase();
  }
  return supabaseClient;
};

export const useAuthStore = create((set, get) => {
  const computeLoading = (state) => {
    const supabase = getSupabase();
    return state._loading || !supabase || (state.user && !state.profile);
  };


  const initialize = async () => {
    const supabase = getSupabase();
    if (!supabase) {
      set((state) => ({ 
        _loading: false, 
        loading: computeLoading({ ...state, _loading: false })
      }));
      return;
    }

    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          if (mounted) {
            set((state) => ({ 
              _loading: false, 
              loading: computeLoading({ ...state, _loading: false })
            }));
          }
          return;
        }

        if (session?.user && mounted) {
          set((state) => ({ 
            user: session.user, 
            _loading: true,
            loading: computeLoading({ ...state, user: session.user, _loading: true })
          }));
          await new Promise(resolve => setTimeout(resolve, 100));
          if (mounted) {
            await get().fetchProfile(session.user.id);
            if (mounted) {
              set((state) => ({ 
                _loading: false,
                loading: computeLoading({ ...state, _loading: false })
              }));
            }
          }
        } else if (mounted) {
  
          set((state) => ({ 
            user: null, 
            profile: null, 
            _loading: false,
            loading: computeLoading({ ...state, user: null, profile: null, _loading: false })
          }));
        }
      } catch (error) {
  
        if (mounted) {
          set((state) => ({ 
            _loading: false,
            loading: computeLoading({ ...state, _loading: false })
          }));
        }
      }
    };

    initializeAuth();

    // Подписка на изменения аутентификации
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        
        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user && mounted) {
            set((state) => ({ 
              user: session.user, 
              _loading: true,
              loading: computeLoading({ ...state, user: session.user, _loading: true })
            }));
            await new Promise(resolve => setTimeout(resolve, 100));
            if (mounted) {
              await get().fetchProfile(session.user.id);
              if (mounted) {
                set((state) => ({ 
                  _loading: false,
                  loading: computeLoading({ ...state, _loading: false })
                }));
              }
            }
          } else if (mounted) {
            set((state) => ({ 
              _loading: false,
              loading: computeLoading({ ...state, _loading: false })
            }));
          }
        } else if (event === 'SIGNED_OUT') {
          if (mounted) {
            set((state) => ({ 
              user: null, 
              profile: null, 
              _loading: false,
              loading: computeLoading({ ...state, user: null, profile: null, _loading: false })
            }));
          }
        } else if (session?.user && mounted) {
          set((state) => ({ 
            user: session.user, 
            _loading: true,
            loading: computeLoading({ ...state, user: session.user, _loading: true })
          }));
          await new Promise(resolve => setTimeout(resolve, 100));
          if (mounted) {
            await get().fetchProfile(session.user.id);
            if (mounted) {
              set((state) => ({ 
                _loading: false,
                loading: computeLoading({ ...state, _loading: false })
              }));
            }
          }
        } else if (mounted) {
          set((state) => ({ 
            user: null, 
            profile: null, 
            _loading: false,
            loading: computeLoading({ ...state, user: null, profile: null, _loading: false })
          }));
        }
      }
    );

    authSubscription = subscription;

    cleanup = () => {
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
        authSubscription = null;
      }
    };
  };

  return {
    user: null,
    profile: null,
    _loading: true,
    loading: true,
    initialized: false,

    // Инициализация (вызывается один раз)
    init: () => {
      const state = get();
      if (!state.initialized && typeof window !== 'undefined') {
        set({ initialized: true });
        initialize();
      }
    },

    // Очистка при размонтировании
    cleanup: () => {
      if (cleanup) {
        cleanup();
        cleanup = null;
      }
    },

    fetchProfile: async (userId, retries = 3) => {
      const supabase = getSupabase();
      if (!supabase) {
        return;
      }
      
      
      try {
        const startTime = Date.now();
        
        const response = await fetch('/api/auth/profile', {
          method: 'GET',
          credentials: 'include',
        });
        
        const duration = Date.now() - startTime;
        
        if (!response.ok) {
          if (response.status === 401) {
            set((state) => ({ 
              profile: null,
              loading: computeLoading({ ...state, profile: null })
            }));
            return;
          }
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        
        const { profile: data } = await response.json();
        
        if (!data) {
          if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return get().fetchProfile(userId, retries - 1);
          } else {
            const supabase = getSupabase();
            if (!supabase) {
              set((state) => ({ 
                profile: null,
                loading: computeLoading({ ...state, profile: null })
              }));
              return;
            }
            
            try {
              const { data: userData } = await supabase.auth.getUser();
              if (userData?.user) {
                const { data: newProfile, error: createError } = await supabase
                  .from('profiles')
                  .insert({
                    id: userId,
                    email: userData.user.email,
                    full_name: userData.user.user_metadata?.full_name || '',
                    role: 'user',
                  })
                  .select()
                  .single();

                if (createError) {
                  set((state) => ({ 
                    profile: null,
                    loading: computeLoading({ ...state, profile: null })
                  }));
                } else {
                  set((state) => ({ 
                    profile: newProfile,
                    loading: computeLoading({ ...state, profile: newProfile })
                  }));
                }
              } else {
                set((state) => ({ 
                  profile: null,
                  loading: computeLoading({ ...state, profile: null })
                }));
              }
            } catch (createError) {
              set((state) => ({ 
                profile: null,
                loading: computeLoading({ ...state, profile: null })
              }));
            }
            return;
          }
        }
        
        set((state) => ({ 
          profile: data,
          loading: computeLoading({ ...state, profile: data })
        }));
      } catch (error) {
        set((state) => ({ 
          profile: null,
          loading: computeLoading({ ...state, profile: null })
        }));
      }
    },

    signUp: async (email, password, fullName = '') => {
      const supabase = getSupabase();
      if (!supabase) {
        return { data: null, error: new Error('Supabase client not initialized') };
      }
      
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          set((state) => ({ 
            user: data.user,
            loading: computeLoading({ ...state, user: data.user })
          }));
          await new Promise(resolve => setTimeout(resolve, 500));
          await get().fetchProfile(data.user.id);
        }

        return { data, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },

    signIn: async (email, password) => {
      const supabase = getSupabase();
      if (!supabase) {
        return { data: null, error: new Error('Supabase client not initialized') };
      }
      
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          set((state) => ({ 
            user: data.user,
            loading: computeLoading({ ...state, user: data.user })
          }));
          await new Promise(resolve => setTimeout(resolve, 100));
          await get().fetchProfile(data.user.id);
        }

        return { data, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },

    signOut: async (router) => {
      const supabase = getSupabase();
      if (!supabase) return;
      
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        set((state) => ({ 
          user: null, 
          profile: null, 
          _loading: false,
          loading: computeLoading({ ...state, user: null, profile: null, _loading: false })
        }));
        // Используем router если передан, иначе window.location
        if (router) {
          router.push('/');
        } else if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      } catch (error) {
        throw error;
      }
    },

    isAdmin: () => {
      const { profile } = get();
      return profile?.role === 'admin';
    },

    get supabase() {
      return getSupabase();
    },
  };
});

