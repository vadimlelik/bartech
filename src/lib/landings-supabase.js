import { supabaseAdmin, supabase } from './supabase';

function checkSupabase() {
  if (!supabaseAdmin) {
    throw new Error('Supabase is not configured. Please check your environment variables.');
  }
}

export async function getAllLandings() {
  try {
    checkSupabase();

    const { data, error } = await supabaseAdmin
      .from('landing_pages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching landings:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllLandings:', error);
    return [];
  }
}

export async function getLandingBySlug(slug) {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured.');
    }

    const { data, error } = await supabase
      .from('landing_pages')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      console.error('Error fetching landing by slug:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getLandingBySlug:', error);
    return null;
  }
}

export async function getLandingById(id) {
  try {
    checkSupabase();

    const { data, error } = await supabaseAdmin
      .from('landing_pages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching landing:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getLandingById:', error);
    return null;
  }
}

export async function createLanding(landingData) {
  try {
    checkSupabase();

    // Обработка данных перед отправкой в Supabase
    const processedData = {
      slug: landingData.slug || null,
      title: landingData.title || null,
      main_title: landingData.main_title || null,
      description: landingData.description || null,
      main_image: landingData.main_image || null,
      secondary_image: landingData.secondary_image || null,
      benefits: Array.isArray(landingData.benefits)
        ? landingData.benefits
        : (landingData.benefits ? [landingData.benefits] : []),
      advantages: Array.isArray(landingData.advantages)
        ? landingData.advantages
        : (landingData.advantages ? [landingData.advantages] : []),
      reviews: Array.isArray(landingData.reviews)
        ? landingData.reviews
        : (landingData.reviews ? [landingData.reviews] : []),
      pixels: Array.isArray(landingData.pixels)
        ? landingData.pixels
        : (landingData.pixels ? [landingData.pixels] : []),
      button_text: landingData.button_text || 'Узнать цену',
      survey_text: landingData.survey_text || null,
      colors: landingData.colors || {},
      styles: landingData.styles || {},
      is_active: landingData.is_active !== undefined ? landingData.is_active : true,
      // Добавляем theme если колонка существует в таблице (для обратной совместимости)
      theme: landingData.theme || null,
    };

    Object.keys(processedData).forEach(key => {
      if (processedData[key] === '') {
        processedData[key] = null;
      }
    });

    const { data, error } = await supabaseAdmin
      .from('landing_pages')
      .insert([processedData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error adding landing:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });

      let userFriendlyError = error.message || 'Failed to create landing';
      if (error.code === '23505') {
        // Unique constraint violation
        userFriendlyError = 'Лендинг с таким slug уже существует';
      } else if (error.code === '23502') {
        // NOT NULL constraint violation
        if (error.message?.includes('theme')) {
          userFriendlyError = 'Ошибка: колонка theme требует значение. Выполните SQL из файла supabase-landing-pages-fix-columns.sql для исправления таблицы';
        } else {
          userFriendlyError = `Ошибка: обязательное поле не заполнено. ${error.message}`;
        }
      } else if (error.code === 'PGRST204' || error.message?.includes('column') || error.message?.includes('advantages') || error.message?.includes('button_text')) {
        // Column not found in schema cache
        userFriendlyError = 'Ошибка: таблица landing_pages не настроена. Выполните SQL из файла supabase-landing-pages-fix-columns.sql в Supabase Dashboard → SQL Editor';
      }

      return { success: false, error: userFriendlyError };
    }

    return { success: true, landing: data };
  } catch (error) {
    console.error('Exception in createLanding:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });
    return { success: false, error: error.message || 'Unexpected error occurred' };
  }
}

export async function updateLanding(id, landingData) {
  try {
    checkSupabase();

    const processedData = {
      slug: landingData.slug || null,
      title: landingData.title || null,
      main_title: landingData.main_title || null,
      description: landingData.description || null,
      main_image: landingData.main_image || null,
      secondary_image: landingData.secondary_image || null,
      benefits: Array.isArray(landingData.benefits)
        ? landingData.benefits
        : (landingData.benefits ? [landingData.benefits] : []),
      advantages: Array.isArray(landingData.advantages)
        ? landingData.advantages
        : (landingData.advantages ? [landingData.advantages] : []),
      reviews: Array.isArray(landingData.reviews)
        ? landingData.reviews
        : (landingData.reviews ? [landingData.reviews] : []),
      pixels: Array.isArray(landingData.pixels)
        ? landingData.pixels
        : (landingData.pixels ? [landingData.pixels] : []),
      button_text: landingData.button_text || 'Узнать цену',
      survey_text: landingData.survey_text || null,
      colors: landingData.colors || {},
      styles: landingData.styles || {},
      is_active: landingData.is_active !== undefined ? landingData.is_active : true,
      // Добавляем theme если колонка существует в таблице (для обратной совместимости)
      theme: landingData.theme || null,
    };

    Object.keys(processedData).forEach(key => {
      if (processedData[key] === '') {
        processedData[key] = null;
      }
    });

    const { data, error } = await supabaseAdmin
      .from('landing_pages')
      .update(processedData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating landing:', error);
      let userFriendlyError = error.message || 'Failed to update landing';
      if (error.code === '23505') {
        userFriendlyError = 'Лендинг с таким slug уже существует';
      }
      return { success: false, error: userFriendlyError };
    }

    if (!data) {
      return { success: false, error: 'Landing not found' };
    }

    return { success: true, landing: data };
  } catch (error) {
    console.error('Error in updateLanding:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteLanding(id) {
  try {
    checkSupabase();

    const { error } = await supabaseAdmin
      .from('landing_pages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting landing:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in deleteLanding:', error);
    return { success: false, error: error.message };
  }
}

