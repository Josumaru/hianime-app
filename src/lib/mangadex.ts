"use server";
import { MangadexChapter } from "@/types/manga/chapter";
import { MangadexManga } from "@/types/manga/popular";
import axios from "axios";
const baseUrl = process.env.MANGADEX_BASE_URL;

export const getPopular = async (): Promise<MangadexManga> => {
  try {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 1);
    const createdAtSince = currentDate.toISOString().slice(0, 19);
    const endpoint = `${baseUrl}/manga?includes[]=cover_art&includes[]=artist&includes[]=author&order[followedCount]=desc&contentRating[]=safe&contentRating[]=suggestive&hasAvailableChapters=true&limit=10&createdAtSince=${createdAtSince}`;
    const data = await axios.get(endpoint);
    return data.data as MangadexManga;
  } catch (error: any) {
    console.log(error);
    throw new Error("Failed to fetch popular manga");
  }
};

export const getLatestUpdate = async (): Promise<MangadexManga> => {
  try {
    const chapterEndpoint = `${baseUrl}/chapter?limit=64&includes[]=scanlation_group&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&order[readableAt]=desc`;
    const chapterResponse = await axios.get<MangadexChapter>(chapterEndpoint);
    const ids = chapterResponse.data.data.flatMap((data) =>
      data.relationships
        .filter((rel) => rel.type === "manga")
        .map((rel) => rel.id)
    );
    const mangaEndpoint = `${baseUrl}/manga?includes[]=cover_art&limit=100&${ids
      .map((id) => `ids[]=${id}`)
      .join(
        "&"
      )}&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic`;
    console.log(mangaEndpoint);

    const mangaResponse = await axios.get<MangadexManga>(mangaEndpoint);
    return mangaResponse.data;
  } catch (error: any) {
    console.log(error.message);
    throw new Error(`Oh hell! Something went wrong (◡︵◡)`);
  }
};

export const getMangadexSearch = async (
  title: string
): Promise<MangadexManga> => {
  try {
    const endpoint = `${baseUrl}/manga?includes[]=cover_art&title=${title}&limit=5&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&includes[]=cover_art&order[relevance]=desc`;
    const response = await axios.get<MangadexManga>(endpoint);
    return response.data;
  } catch (error: any) {
    throw new Error("Oh hell, Something went wrong ( ?? ?? ??) ");
  }
};
