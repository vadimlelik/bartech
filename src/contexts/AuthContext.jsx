'use client';

import { createContext, useContext, useEffect, useState, startTransition } from 'react';
import { createClientSupabase } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [supabase, setSupabase] = useState(null);
  const router = useRouter();

  // Инициализируем Supabase клиент только на клиенте
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const client = createClientSupabase();
      setSupabase(client);
      // Если клиент не создан (на сервере), устанавливаем loading в false
      if (!client) {
        setLoading(false);
      }
    } else {
      // На сервере всегда loading = false
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!supabase) return;

    let mounted = true;

    // Проверяем текущую сессию при загрузке
    const initializeAuth = async () => {
      try {
        // Сначала проверяем сессию
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        if (session?.user && mounted) {
          console.log('Session found on mount:', session.user.id);
          startTransition(() => {
            setUser(session.user);
          });
          // Ждем немного, чтобы сессия полностью восстановилась из cookies
          await new Promise(resolve => setTimeout(resolve, 100));
          if (mounted) {
            await fetchProfile(session.user.id);
            if (mounted) {
              startTransition(() => {
                setLoading(false);
              });
            }
          }
        } else if (mounted) {
          console.log('No session found on mount');
          startTransition(() => {
            setUser(null);
            setProfile(null);
            setLoading(false);
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Слушаем изменения в авторизации
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.id);
        
        // Обрабатываем разные события
        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user && mounted) {
            startTransition(() => {
              setUser(session.user);
            });
            // Ждем немного, чтобы сессия полностью восстановилась из cookies
            await new Promise(resolve => setTimeout(resolve, 100));
            if (mounted) {
              await fetchProfile(session.user.id);
              if (mounted) {
                startTransition(() => {
                  setLoading(false);
                });
              }
            }
          } else if (mounted) {
            startTransition(() => {
              setLoading(false);
            });
          }
        } else if (event === 'SIGNED_OUT') {
          if (mounted) {
            startTransition(() => {
              setUser(null);
              setProfile(null);
              setLoading(false);
            });
          }
        } else if (session?.user && mounted) {
          // Для других событий, если есть сессия
          startTransition(() => {
            setUser(session.user);
          });
          // Ждем немного, чтобы сессия полностью восстановилась из cookies
          await new Promise(resolve => setTimeout(resolve, 100));
          if (mounted) {
            await fetchProfile(session.user.id);
            if (mounted) {
              startTransition(() => {
                setLoading(false);
              });
            }
          }
        } else if (mounted) {
          startTransition(() => {
            setUser(null);
            setProfile(null);
            setLoading(false);
          });
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const fetchProfile = async (userId, retries = 3) => {
    if (!supabase) {
      console.log('fetchProfile: No supabase client');
      return;
    }
    
    console.log('fetchProfile: Fetching profile for user:', userId, 'retries left:', retries);
    
    try {
      // Используем API route вместо прямого запроса к Supabase
      // Это помогает избежать проблем с зависанием запросов
      console.log('fetchProfile: Fetching profile via API...');
      const startTime = Date.now();
      
      const response = await fetch('/api/auth/profile', {
        method: 'GET',
        credentials: 'include',
      });
      
      const duration = Date.now() - startTime;
      
      if (!response.ok) {
        if (response.status === 401) {
          console.warn('fetchProfile: Unauthorized');
          startTransition(() => {
            setProfile(null);
          });
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const { profile: data } = await response.json();
      
      console.log(`fetchProfile: Query completed in ${duration}ms`, { 
        hasData: !!data,
        role: data?.role
      });
      
      // Если профиль не найден, пытаемся создать его
      if (!data) {
        if (retries > 0) {
          // Ждем немного и повторяем (триггер мог еще не сработать)
          console.log(`fetchProfile: Profile not found, retrying... (${retries} retries left)`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          return fetchProfile(userId, retries - 1);
        } else {
          // Если после всех попыток профиль не найден, создаем его вручную
          console.log('Profile not found, creating manually...');
          if (!supabase) {
            startTransition(() => {
              setProfile(null);
            });
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
                console.error('Error creating profile:', createError);
                startTransition(() => {
                  setProfile(null);
                });
              } else {
                console.log('Profile created successfully');
                startTransition(() => {
                  setProfile(newProfile);
                });
              }
            } else {
              startTransition(() => {
                setProfile(null);
              });
            }
          } catch (createError) {
            console.error('Error creating profile:', createError);
            startTransition(() => {
              setProfile(null);
            });
          }
          return;
        }
      }
      
      console.log('fetchProfile: Profile loaded successfully:', { role: data?.role, email: data?.email });
      startTransition(() => {
        setProfile(data);
      });
      console.log('fetchProfile: Profile state updated');
    } catch (error) {
      console.error('Error fetching profile:', error);
      startTransition(() => {
        setProfile(null);
      });
    }
  };

  const signUp = async (email, password, fullName = '') => {
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
        startTransition(() => {
          setUser(data.user);
        });
        // Профиль будет создан автоматически через триггер
        // Ждем немного, чтобы триггер успел создать профиль
        await new Promise(resolve => setTimeout(resolve, 500));
        await fetchProfile(data.user.id);
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error signing up:', error);
      return { data: null, error };
    }
  };

  const signIn = async (email, password) => {
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
        console.log('Sign in successful:', data.user.id);
        startTransition(() => {
          setUser(data.user);
        });
        // Ждем немного, чтобы сессия сохранилась в cookies
        await new Promise(resolve => setTimeout(resolve, 100));
        await fetchProfile(data.user.id);
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    if (!supabase) return;
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      startTransition(() => {
        setUser(null);
        setProfile(null);
      });
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const isAdmin = () => {
    return profile?.role === 'admin';
  };

  // loading должен быть true, если:
  // 1. supabase не инициализирован
  // 2. идет загрузка (loading === true)
  // 3. есть user, но profile еще не загружен
  const isLoading = loading || !supabase || (user && !profile);

  const value = {
    user,
    profile,
    loading: isLoading,
    signUp,
    signIn,
    signOut,
    isAdmin,
    supabase,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

