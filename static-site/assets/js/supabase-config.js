// WristWatch.uz — Supabase configuration
// Bu qiymatlarni Supabase loyihangizdan (Project Settings → API) oling.
// MUHIM: bu yerga faqat "anon public" kalitni qo'ying, hech qachon "service_role" kalitni emas.

window.SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co';
window.SUPABASE_ANON_KEY = 'YOUR-ANON-PUBLIC-KEY';

window.getSupabaseClient = function () {
  if (!window._supabaseClient) {
    if (!window.supabase || !window.supabase.createClient) {
      console.error('Supabase JS kutubxonasi yuklanmagan. HTML faylida CDN skript ulanganini tekshiring.');
      return null;
    }
    window._supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  }
  return window._supabaseClient;
};
