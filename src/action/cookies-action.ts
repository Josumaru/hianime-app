"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY ?? "";

export const createCookies = async (
  name: string,
  payload: object
) => {
  const token = jwt.sign(payload, SECRET_KEY);
  const cookieStore = cookies();

  (await cookieStore).set({
    name: name,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
};

export const getCookies = async (name: string) => {
  const cookieStore = cookies();
  const token = (await cookieStore).get(name)?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
};
