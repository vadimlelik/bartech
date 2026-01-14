import { getServerSupabaseClient } from '@/lib/auth-helpers';
import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';

export async function GET(request) {
  try {
    const supabase = await getServerSupabaseClient();
    
    if (!supabase) {
      console.error('getServerSupabaseClient returned null/undefined');
      return NextResponse.json(
        { error: 'Supabase client not initialized' },
        { status: 500 }
      );
    }
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Кэшируем профиль пользователя на 2 минуты для снижения нагрузки на Supabase
    // Профиль пользователя меняется редко, поэтому кэширование безопасно
    // Используем userId в ключе кэша для уникальности каждого пользователя
    const getCachedProfile = unstable_cache(
      async (userId) => {
        const supabase = await getServerSupabaseClient();
        if (!supabase) {
          return { profile: null, profileError: new Error('Supabase client not initialized') };
        }
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        return { profile, profileError };
      },
      [`user-profile-${user.id}`], // Уникальный ключ для каждого пользователя
      {
        revalidate: 120, // 2 минуты
        tags: ['profiles', `profile-${user.id}`],
      }
    );
    
    const { profile, profileError } = await getCachedProfile(user.id);
    
    if (profileError) {
      if (profileError.code === 'PGRST116') {
        return NextResponse.json(
          { profile: null },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

