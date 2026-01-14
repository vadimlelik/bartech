import { getServerSupabaseClient } from '@/lib/auth-helpers';
import { NextResponse } from 'next/server';

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
    
    // НЕ кэшируем профиль пользователя - это критично для корректной работы регистрации и входа
    // Профиль может быть создан сразу после регистрации, и кэш может не видеть новый профиль
    // Для снижения нагрузки на Supabase лучше оптимизировать другие запросы
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
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

