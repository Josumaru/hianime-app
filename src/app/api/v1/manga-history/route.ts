import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/db";
import { historyManga } from "@/db/schema";
import { createClient } from "@/utils/supabase/server";
import { desc, eq } from "drizzle-orm";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const supabase = await createClient();
  const formData = await req.formData();

  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    const chapter = formData.get("chapter") as string;
    const volume = formData.get("volume") as string;
    const title = formData.get("title") as string;
    const mangaId = formData.get("mangaId") as string;
    const chapterId = formData.get("chapterId") as string;
    const cover = formData.get("cover") as string;
    const mangaTitle = formData.get("mangaTitle") as string;

    if (
      !userId ||
      !chapter ||
      !volume ||
      !title ||
      !mangaId ||
      !chapterId ||
      !cover ||
      !mangaTitle
    ) {
      throw new Error("All fields are required");
    }

    const existingHistory = await db
      .select()
      .from(historyManga)
      .where(eq(historyManga.chapterId, chapterId))
      .execute();

    if (existingHistory.length > 0) {
      const updatedHistory = await db
        .update(historyManga)
        .set({
          chapter,
          volume,
          title,
          mangaId,
          cover,
          createdAt: new Date().toISOString(),
        })
        .where(eq(historyManga.chapterId, chapterId))
        .returning();

      return NextResponse.json(
        {
          success: true,
          message: "History manga updated successfully",
          history: updatedHistory,
        },
        { status: 200 }
      );
    } else {
      const newHistory = await db
        .insert(historyManga)
        .values({
          userId,
          chapter,
          mangaTitle,
          volume,
          title,
          mangaId,
          chapterId,
          cover,
        })
        .returning();

      return NextResponse.json(
        {
          success: true,
          message: "History manga created successfully",
          history: newHistory,
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
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
      .from(historyManga)
      .where(eq(historyManga.userId, userId))
      .orderBy(desc(historyManga.createdAt))
      .execute();

    return NextResponse.json(
      {
        success: true,
        message: "History manga retrieved successfully",
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
