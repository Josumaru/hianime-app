import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/db";
import { historyAnime } from "@/db/schema";
import { createClient } from "@/utils/supabase/server";
import { desc, eq } from "drizzle-orm";
import { decrypt, encrypt } from "@/lib/aes";

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

    const histories = await db
      .select()
      .from(historyAnime)
      .where(eq(historyAnime.userId, userId))
      .execute();

      const existingHistory = histories.find(
        (h) => decrypt(h.episodeId ?? "") === episodeId
      );

    if (existingHistory) {
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
          userId: userId,
          episode: encrypt(episode),
          animeId: encrypt(animeId),
          episodeId: encrypt(episodeId),
          animeTitle: encrypt(animeTitle),
          title: encrypt(title),
          cover: encrypt(cover),
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
      .from(historyAnime)
      .where(eq(historyAnime.userId, userId))
      .orderBy(desc(historyAnime.createdAt))
      .execute();

    const decryptedHistory = userHistory.map((history) => ({
      ...history,
      episode: decrypt(history.episode ?? ""),
      animeId: decrypt(history.animeId ?? ""),
      animeTitle: decrypt(history.animeTitle ?? ""),
      title: decrypt(history.title ?? ""),
      episodeId: decrypt(history.episodeId ?? ""),
      cover: decrypt(history.cover ?? ""),
    }));

    return NextResponse.json(
      {
        success: true,
        message: "History anime retrieved successfully",
        history: decryptedHistory,
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

// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/db/db";
// import { historyAnime } from "@/db/schema";
// import { createClient } from "@/utils/supabase/server";
// import { desc, eq } from "drizzle-orm";
// import crypto from "crypto";

// const algorithm = "aes-256-gcm";
// const secretKey = process.env.ENCRYPTION_KEY ?? ""; // Pastikan key ini 32 bytes panjangnya
// const ivLength = 16;

// function encrypt(text: string) {
//   const iv = crypto.randomBytes(ivLength);
//   const cipher = crypto.createCipheriv(
//     algorithm,
//     Buffer.from(secretKey, "hex"),
//     iv
//   );
//   let encrypted = cipher.update(text, "utf8", "hex");
//   encrypted += cipher.final("hex");
//   const authTag = cipher.getAuthTag().toString("hex");
//   return `${iv.toString("hex")}:${authTag}:${encrypted}`;
// }

// function decrypt(text: string) {
//   const [iv, authTag, encryptedText] = text.split(":");
//   const decipher = crypto.createDecipheriv(
//     algorithm,
//     Buffer.from(secretKey, "hex"),
//     Buffer.from(iv, "hex")
//   );
//   decipher.setAuthTag(Buffer.from(authTag, "hex"));
//   let decrypted = decipher.update(encryptedText, "hex", "utf8");
//   decrypted += decipher.final("utf8");
//   return decrypted;
// }

// export async function POST(req: NextRequest): Promise<NextResponse> {
//   const supabase = await createClient();
//   const formData = await req.formData();

//   try {
//     const userId = (await supabase.auth.getUser()).data.user?.id;
//     if (!userId) {
//       throw new Error("User not authenticated");
//     }

//     const episode = encrypt(formData.get("episode") as string);
//     const animeId = encrypt(formData.get("animeId") as string);
//     const animeTitle = encrypt(formData.get("animeTitle") as string);
//     const title = encrypt(formData.get("title") as string);
//     const episodeId = encrypt(formData.get("episodeId") as string);
//     const cover = encrypt(formData.get("cover") as string);

//     if (!episode || !animeId || !episodeId || !cover || !title || !animeTitle) {
//       throw new Error("All fields are required");
//     }

//     const existingHistory = await db
//       .select()
//       .from(historyAnime)
//       .where(eq(historyAnime.episodeId, episodeId))
//       .execute();

//     if (existingHistory.length > 0) {
//       const updatedHistory = await db
//         .update(historyAnime)
//         .set({
//           episode,
//           animeId,
//           cover,
//           createdAt: new Date().toISOString(),
//         })
//         .where(eq(historyAnime.episodeId, episodeId))
//         .returning();

//       return NextResponse.json(
//         {
//           success: true,
//           message: "History anime updated successfully",
//           history: updatedHistory,
//         },
//         { status: 200 }
//       );
//     } else {
//       const newHistory = await db
//         .insert(historyAnime)
//         .values({
//           userId,
//           episode,
//           animeId,
//           episodeId,
//           animeTitle,
//           title,
//           cover,
//         })
//         .returning();

//       return NextResponse.json(
//         {
//           success: true,
//           message: "History anime created successfully",
//           history: newHistory,
//         },
//         { status: 200 }
//       );
//     }
//   } catch (error: any) {
//     console.log(error);
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 400 }
//     );
//   }
// }

// export async function GET(req: NextRequest): Promise<NextResponse> {
//   const supabase = await createClient();

//   try {
//     const userId = (await supabase.auth.getUser()).data.user?.id;

//     if (!userId) {
//       throw new Error("User not authenticated");
//     }

//     const userHistory = await db
//       .select()
//       .from(historyAnime)
//       .where(eq(historyAnime.userId, userId))
//       .orderBy(desc(historyAnime.createdAt))
//       .execute();

//     const decryptedHistory = userHistory.map((history) => ({
//       ...history,
//       episode: decrypt(history.episode ?? ""),
//       animeId: decrypt(history.animeId ?? ""),
//       animeTitle: decrypt(history.animeTitle ?? ""),
//       title: decrypt(history.title ?? ""),
//       episodeId: decrypt(history.episodeId ?? ""),
//       cover: decrypt(history.cover ?? ""),
//     }));

//     return NextResponse.json(
//       {
//         success: true,
//         message: "History anime retrieved successfully",
//         history: decryptedHistory,
//       },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 400 }
//     );
//   }
// }

// // import { NextRequest, NextResponse } from "next/server";
// // import { db } from "@/db/db";
// // import { historyAnime } from "@/db/schema";
// // import { createClient } from "@/utils/supabase/server";
// // import { desc, eq } from "drizzle-orm";

// // export async function POST(req: NextRequest): Promise<NextResponse> {
// //   const supabase = await createClient();
// //   const formData = await req.formData();

// //   try {
// //     const userId = (await supabase.auth.getUser()).data.user?.id;
// //     const episode = formData.get("episode") as string;
// //     const animeId = formData.get("animeId") as string;
// //     const animeTitle = formData.get("animeTitle") as string;
// //     const title = formData.get("title") as string;
// //     const episodeId = formData.get("episodeId") as string;
// //     const cover = formData.get("cover") as string;

// //     if (
// //       !userId ||
// //       !episode ||
// //       !animeId ||
// //       !episodeId ||
// //       !cover ||
// //       !title ||
// //       !animeTitle
// //     ) {
// //       throw new Error("All fields are required");
// //     }

// //     const existingHistory = await db
// //       .select()
// //       .from(historyAnime)
// //       .where(eq(historyAnime.episodeId, episodeId))
// //       .execute();

// //     if (existingHistory.length > 0) {
// //       const updatedHistory = await db
// //         .update(historyAnime)
// //         .set({
// //           episode,
// //           animeId,
// //           cover,
// //           createdAt: new Date().toISOString(),
// //         })
// //         .where(eq(historyAnime.episodeId, episodeId))
// //         .returning();

// //       return NextResponse.json(
// //         {
// //           success: true,
// //           message: "History anime updated successfully",
// //           history: updatedHistory,
// //         },
// //         { status: 200 }
// //       );
// //     } else {
// //       const newHistory = await db
// //         .insert(historyAnime)
// //         .values({
// //           userId,
// //           episode,
// //           animeId,
// //           episodeId,
// //           animeTitle,
// //           title,
// //           cover,
// //         })
// //         .returning();

// //       return NextResponse.json(
// //         {
// //           success: true,
// //           message: "History anime created successfully",
// //           history: newHistory,
// //         },
// //         { status: 200 }
// //       );
// //     }
// //   } catch (error: any) {
// //     console.log(error)
// //     return NextResponse.json(
// //       { success: false, message: error.message },
// //       { status: 400 }
// //     );
// //   }
// // }

// // export async function GET(req: NextRequest): Promise<NextResponse> {
// //   const supabase = await createClient();

// //   try {
// //     const userId = (await supabase.auth.getUser()).data.user?.id;

// //     if (!userId) {
// //       throw new Error("User not authenticated");
// //     }

// //     const userHistory = await db
// //       .select()
// //       .from(historyAnime)
// //       .where(eq(historyAnime.userId, userId))
// //       .orderBy(desc(historyAnime.createdAt))
// //       .execute();

// //     return NextResponse.json(
// //       {
// //         success: true,
// //         message: "History anime retrieved successfully",
// //         history: userHistory,
// //       },
// //       { status: 200 }
// //     );
// //   } catch (error: any) {
// //     return NextResponse.json(
// //       { success: false, message: error.message },
// //       { status: 400 }
// //     );
// //   }
// // }
