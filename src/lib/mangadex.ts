"use server";
const baseUrl = process.env.MANGADEX_BASE_URL;
import { PopularManga } from "@/types/manga/popular";
import axios from "axios";

export const getPopular = async (): Promise<PopularManga> => {
  try {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 1);
    const createdAtSince = currentDate.toISOString().slice(0, 19);
    const endpoint = `${baseUrl}/manga?includes[]=cover_art&includes[]=artist&includes[]=author&order[followedCount]=desc&contentRating[]=safe&contentRating[]=suggestive&hasAvailableChapters=true&createdAtSince=${createdAtSince}`
    const response = await axios.get('https://api.mangadex.org/manga', {
      params: {
        'includes[]': ['cover_art', 'artist', 'author'],
        'order[followedCount]': 'desc',
        'contentRating[]': ['safe', 'suggestive'],
        hasAvailableChapters: true,
        createdAtSince: '2024-12-16T17:00:00'
      },
      headers: {
          'accept': '*/*',
          'accept-encoding': 'gzip, deflate, br, zstd',
          'accept-language': 'en-US,en;q=0.9,id;q=0.8',
          'origin': 'https://mangadex.org',
          'referer': 'https://mangadex.org/',
          'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
        }
    });

    return response.data as PopularManga;
  } catch (error: any) {
    console.log(error);
    throw new Error("Failed to fetch popular manga");
  }
};
