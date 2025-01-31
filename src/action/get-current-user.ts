"use server";
import { createClient } from "@/utils/supabase/server";

export const getCurrentUser = async () => {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  const data = await supabase
    .from("users")
    .select()
    .eq("user_id", user.data.user?.id);
  return { user, data };
};
