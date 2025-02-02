import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/db";
import { historyAnime } from "@/db/schema";
import { createClient } from "@/utils/supabase/server";
import { desc, eq } from "drizzle-orm";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const supabase = await createClient();
  const formData = await req.formData();

  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    const episode = formData.get("episode") as string;
    const animeId = formData.get("animeId") as string;
    const animeTitle = formData.get("animeTitle") as string;
    const title = formData.get("title") as string;
    const episodeId = formData.get("episodeId") as string;
    const cover = formData.get("cover") as string;

    if (
      !userId ||
      !episode ||
      !animeId ||
      !episodeId ||
      !cover ||
      !title ||
      !animeTitle
    ) {
      throw new Error("All fields are required");
    }

    const existingHistory = await db
      .select()
      .from(historyAnime)
      .where(eq(historyAnime.episodeId, episodeId))
      .execute();

    if (existingHistory.length > 0) {
      const updatedHistory = await db
        .update(historyAnime)
        .set({
          episode,
          animeId,
          cover,
          createdAt: new Date().toISOString(),
        })
        .where(eq(historyAnime.episodeId, episodeId))
        .returning();

      return NextResponse.json(
        {
          success: true,
          message: "History anime updated successfully",
          history: updatedHistory,
        },
        { status: 200 }
      );
    } else {
      const newHistory = await db
        .insert(historyAnime)
        .values({
          userId,
          episode,
          animeId,
          episodeId,
          animeTitle,
          title,
          cover,
        })
        .returning();

      return NextResponse.json(
        {
          success: true,
          message: "History anime created successfully",
          history: newHistory,
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.log(error)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}


export async function GET(req: NextRequest): Promise<NextResponse> {
  const supabase = await createClient();

  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const userHistory = await db
      .select()
      .from(historyAnime)
      .where(eq(historyAnime.userId, userId))
      .orderBy(desc(historyAnime.createdAt))
      .execute();

    return NextResponse.json(
      {
        success: true,
        message: "History anime retrieved successfully",
        history: userHistory,
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
