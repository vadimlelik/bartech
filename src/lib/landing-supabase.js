import { supabaseAdmin } from './supabase';

function checkSupabase() {
  if (!supabaseAdmin) {
    throw new Error('Supabase is not configured. Please check your environment variables.');
  }
}

export async function getAllLandingPages() {
  try {
    checkSupabase();
    
    const { data, error } = await supabaseAdmin
      .from('landing_pages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching landing pages:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllLandingPages:', error);
    return [];
  }
}

export async function getLandingPageBySlug(slug) {
  try {
    checkSupabase();
    
    const { data, error } = await supabaseAdmin
      .from('landing_pages')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching landing page:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getLandingPageBySlug:', error);
    return null;
  }
}

export async function getLandingPageById(id) {
  try {
    checkSupabase();
    
    const { data, error } = await supabaseAdmin
      .from('landing_pages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching landing page:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getLandingPageById:', error);
    return null;
  }
}

export async function addLandingPage(landingData) {
  try {
    checkSupabase();
    
    const processedData = {
      slug: landingData.slug?.trim() || null,
      title: landingData.title?.trim() || null,
      theme: landingData.theme || 'phone2',
      content: landingData.content || {},
      images: Array.isArray(landingData.images) ? landingData.images : [],
      pixels: Array.isArray(landingData.pixels) ? landingData.pixels : [],
      is_active: landingData.is_active !== undefined ? landingData.is_active : true,
    };

    // Валидация
    if (!processedData.slug || !processedData.title) {
      return { success: false, error: 'Slug and title are required' };
    }

    if (!['phone2', 'phone3', 'phone4', 'universal4'].includes(processedData.theme)) {
      return { success: false, error: 'Theme must be phone2, phone3, phone4, or universal4' };
    }

    console.log('Attempting to insert landing page:', { 
      slug: processedData.slug,
      title: processedData.title,
      theme: processedData.theme
    });

    const { data, error } = await supabaseAdmin
      .from('landing_pages')
      .insert([processedData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      if (error.code === '23505') {
        return { success: false, error: 'Landing page with this slug already exists' };
      }
      return { success: false, error: error.message || 'Failed to create landing page' };
    }

    return { success: true, landingPage: data };
  } catch (error) {
    console.error('Error in addLandingPage:', error);
    return { success: false, error: error.message || 'Failed to create landing page' };
  }
}

export async function updateLandingPage(id, landingData) {
  try {
    checkSupabase();
    
    const processedData = {
      slug: landingData.slug?.trim() || null,
      title: landingData.title?.trim() || null,
      theme: landingData.theme || 'phone2',
      content: landingData.content || {},
      images: Array.isArray(landingData.images) ? landingData.images : [],
      pixels: Array.isArray(landingData.pixels) ? landingData.pixels : [],
      is_active: landingData.is_active !== undefined ? landingData.is_active : true,
    };

    // Валидация
    if (!processedData.slug || !processedData.title) {
      return { success: false, error: 'Slug and title are required' };
    }

    if (!['phone2', 'phone3', 'phone4', 'universal4'].includes(processedData.theme)) {
      return { success: false, error: 'Theme must be phone2, phone3, phone4, or universal4' };
    }

    console.log('Attempting to update landing page:', { 
      id,
      slug: processedData.slug,
      title: processedData.title,
      theme: processedData.theme
    });

    const { data, error } = await supabaseAdmin
      .from('landing_pages')
      .update(processedData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      if (error.code === '23505') {
        return { success: false, error: 'Landing page with this slug already exists' };
      }
      return { success: false, error: error.message || 'Failed to update landing page' };
    }

    return { success: true, landingPage: data };
  } catch (error) {
    console.error('Error in updateLandingPage:', error);
    return { success: false, error: error.message || 'Failed to update landing page' };
  }
}

export async function deleteLandingPage(id) {
  try {
    checkSupabase();
    
    const { error } = await supabaseAdmin
      .from('landing_pages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return { success: false, error: error.message || 'Failed to delete landing page' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in deleteLandingPage:', error);
    return { success: false, error: error.message || 'Failed to delete landing page' };
  }
}
