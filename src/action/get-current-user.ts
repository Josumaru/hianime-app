"use server";
import { decrypt } from "@/lib/aes";
import { createClient } from "@/utils/supabase/server";

export const getCurrentUser = async () => {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  console.log(user.data.user?.id);
  const userData = await supabase
    .from("users")
    .select()
    .eq("user_id", user.data.user?.id).single()
  console.log(userData);
  return {
    user,
    data: {
      userId: userData.data.user_id,
      name: decrypt(userData.data.name),
      email: decrypt(userData.data.name),
      createdAt: decrypt(userData.data.name),
      profileImage: decrypt(userData.data.profile_image),
      animePreferences: decrypt(userData.data.anime_preferences),
      mangaPreferences: decrypt(userData.data.manga_preferences),
      themePreferences: decrypt(userData.data.theme_preferences),
    },
  };
};
