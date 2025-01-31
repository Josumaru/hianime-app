"use server";

import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { createClient } from "@/utils/supabase/server";

const SECRET_KEY = process.env.SECRET_KEY ?? "";

export const createCookies = async (
  name: string,
  payload: object,
  preferences: "anime" | "manga" | null = null
) => {
  let token = jwt.sign(payload, SECRET_KEY);
  const cookieStore = cookies();
  const supabase = await createClient();
  const id = (await supabase.auth.getUser()).data.user?.id;
  const isSignedJwt = (await cookieStore).get(name)?.value;

  if (preferences == "anime" && id && !isSignedJwt) {
    const userPreferences = await supabase
      .from("users")
      .select("anime_preferences")
      .single();
    if (userPreferences.data?.anime_preferences) {
      token = userPreferences.data.anime_preferences;
      console.log({ anunya: userPreferences });
    }
  }
  if (preferences == "anime" && id && isSignedJwt) {
    await supabase
      .from("users")
      .update({
        anime_preferences: token,
      })
      .eq("user_id", id);
  }
  if (preferences == "manga" && id && !isSignedJwt) {
    const userPreferences = await supabase
      .from("users")
      .select("manga_preferences")
      .single();
    if (userPreferences.data?.manga_preferences) {
      token = userPreferences.data.manga_preferences;
    }
    await supabase
      .from("users")
      .update({
        manga_preferences: token,
      })
      .eq("user_id", id);
  }
  if (preferences == "manga" && id && isSignedJwt) {
    await supabase
      .from("users")
      .update({
        manga_preferences: token,
      })
      .eq("user_id", id);
  }

  (await cookieStore).set({
    name: name,
    value: token,
    expires: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000),
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
};

export const getCookies = async (
  name: string,
  preferences: "anime" | "manga" | null = null
) => {
  const cookieStore = cookies();
  const token = (await cookieStore).get(name)?.value;
  const supabase = await createClient();
  const id = (await supabase.auth.getUser()).data.user?.id;
  if (!token) return null;

  try {
    let decoded: string | JwtPayload = "";
    if (!id) {
      decoded = jwt.verify(token, SECRET_KEY);
    }
    if (preferences == "anime" && id) {
      const animePreferences = await supabase
        .from("users")
        .select("anime_preferences")
        .eq("user_id", id)
        .single();
      if (animePreferences.data?.anime_preferences) {
        decoded = jwt.verify(
          animePreferences.data.anime_preferences,
          SECRET_KEY
        );
      }
    }
    if (preferences == "manga" && id) {
      const mangaPreferences = await supabase
        .from("users")
        .select("manga_preferences")
        .eq("user_id", id)
        .single();
      if (mangaPreferences.data?.manga_preferences) {
        decoded = jwt.verify(
          mangaPreferences.data.manga_preferences,
          SECRET_KEY
        );
      }
    }

    return decoded;
  } catch (err) {
    return null;
  }
};
