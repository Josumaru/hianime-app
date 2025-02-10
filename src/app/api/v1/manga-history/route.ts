import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/db";
import { historyManga } from "@/db/schema";
import { createClient } from "@/utils/supabase/server";
import { desc, eq } from "drizzle-orm";
import { decrypt, encrypt } from "@/lib/aes";

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
          chapter: encrypt(chapter),
          volume: encrypt(volume),
          title: encrypt(title),
          mangaId: encrypt(mangaId),
          cover: encrypt(cover),
          createdAt: encrypt(new Date().toISOString()),
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
          userId: userId,
          chapter: encrypt(chapter),
          mangaTitle: encrypt(mangaTitle),
          volume: encrypt(volume),
          title: encrypt(title),
          mangaId: encrypt(mangaId),
          chapterId: encrypt(chapterId),
          cover: encrypt(cover),
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
    console.log(error);
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

    const decryptedHistory = userHistory.map((history) => ({
      ...history,
      chapter: decrypt(history.chapter ?? ""),
      mangaId: decrypt(history.mangaId ?? ""),
      mangaTitle: decrypt(history.mangaTitle ?? ""),
      title: decrypt(history.title ?? ""),
      episodeId: decrypt(history.mangaId ?? ""),
      cover: decrypt(history.cover ?? ""),
      chapterId: decrypt(history.chapterId ?? ""),
      volume: decrypt(history.volume ?? ""),
    }));

    return NextResponse.json(
      {
        success: true,
        message: "History manga retrieved successfully",
        history: decryptedHistory,
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
