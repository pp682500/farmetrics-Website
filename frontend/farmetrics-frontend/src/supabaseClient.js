import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ezonwyavnlfxmsacgcok.supabase.co";
const supabaseAnonKey = "sb_publishable_aaGnu45Zhky1JoAlBhDnhw_J5HOGyMO";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
