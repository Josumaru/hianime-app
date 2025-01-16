"use server";
import { PopularManga } from "@/types/manga/popular";
import axios from "axios";
const baseUrl = process.env.MANGADEX_BASE_URL;

export const getPopular = async (): Promise<PopularManga> => {
  try {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 1);
    const createdAtSince = currentDate.toISOString().slice(0, 19);
    const endpoint = `${baseUrl}/manga?includes[]=cover_art&includes[]=artist&includes[]=author&order[followedCount]=desc&contentRating[]=safe&contentRating[]=suggestive&hasAvailableChapters=true&limit=10&createdAtSince=${createdAtSince}`
    const data = await axios.get(endpoint);
    return data.data as PopularManga;
  } catch (error: any) {
    console.log(error);
    throw new Error("Failed to fetch popular manga");
  }
};
