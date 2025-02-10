import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const supabase = await createClient();
  const formData = await req.formData();

  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    console.log({ email, password });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      let message = "";
      switch (error.code) {
        case "invalid_login_credentials":
          message = "Invalid email or password.";
          break;
        case "invalid_credentials":
          message = "Invalid email or password.";
          break;
        default:
          message = "An unexpected error occurred.";
          break;
      }
      throw new Error(message);
    }

    return NextResponse.json(
      {
        success: true,
        message: "User signed in successfully",
        user: {
          id: data.user?.id,
          email: data.user?.email,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
