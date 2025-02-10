import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/db";
import { createClient } from "@/utils/supabase/server";
import { users } from "@/db/schema";
import { decrypt, encrypt } from "@/lib/aes";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const supabase = await createClient();
  const formData = await req.formData();
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      let message = "";
      switch (error.code) {
        case "user_already_exists":
          message = "Email is already in use.";
          break;
        default:
          message = "An unexpected error occurred.";
          break;
      }
      throw new Error(message);
    }

    await db.insert(users).values({
      name: encrypt(name),
      animePreferences: "::",
      mangaPreferences: "::",
      themePreferences: "::",
      profileImage: encrypt(`https://avatar.vercel.sh/${data.user?.id}`),
      userId: data.user?.id,
      email: encrypt(email),
    });

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        user: {
          id: data.user?.id,
          name,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
