import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// During `npm run build` the env vars may not be set yet (e.g. on Vercel before
// you add them in the dashboard). We fall back to a dummy URL so the module can
// be imported without crashing. Actual API calls will return null/empty arrays
// and the public pages will show their built-in fallback content.
const url  = supabaseUrl  || 'https://placeholder.supabase.co';
const key  = supabaseAnonKey || 'placeholder-anon-key';

if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      '[Supabase] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.\n' +
      'Add your real credentials to .env.local and restart the dev server.'
    );
  }
}

export const supabase = createClient(url, key);
