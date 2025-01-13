"use server";

import { encrypt } from "@/lib/crypto";
import { cookies } from "next/headers";

export const createCookies = async (name: string, value: any) => {
  const cookieStore = await cookies();

  cookieStore.set({
    name: name,
    value: value,
  });
};

export const getCookies = async (name: string) => {
  const cookieStore = await cookies();
  return cookieStore.get(name);
};
