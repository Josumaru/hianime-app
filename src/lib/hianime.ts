"use server";
import { Category } from "@/types/anime/category";
import { Episodes } from "@/types/anime/episodes";
import { Hianime } from "@/types/anime/hianime";
import { Info } from "@/types/anime/info";
import { Schedule } from "@/types/anime/schedule";
import { Search } from "@/types/anime/search";
import { Servers } from "@/types/anime/servers";
import { Stream } from "@/types/anime/stream";
import axios from "axios";

const apiBaseUrl = process.env.API_BASE_URL;

export const getHianime = async (): Promise<Hianime> => {
  try {
    const endpoint = `${apiBaseUrl}/api/`;
    const data = await axios.get(endpoint);
    return data.data as Hianime;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.message);
    } else {
      throw new Error(`An unexpected error occurred: ${error.message}`);
    }
  }
};

export const getInfo = async (id: string): Promise<Info> => {
  try {
    const endpoint = `${apiBaseUrl}/api/info?id=${id}`;
    const data = await axios.get(endpoint);
    return data.data as Info;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.message);
    } else {
      throw new Error(`An unexpected error occurred: ${error.message}`);
    }
  }
};

export const getEpisodes = async (id: string): Promise<Episodes> => {
  try {
    const endpoint = `${apiBaseUrl}/api/episodes/${id}`;
    const data = await axios.get(endpoint);
    return data.data as Episodes;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `No episodes? hmmm I don't know either. btw ${error.message} -_-`
      );
    } else {
      throw new Error(
        `You don't have to be sad, developers make it more sad ૮(˶ㅠ︿ㅠ)ა`
      );
    }
  }
};

export const getSearch = async (keyword: string): Promise<Search> => {
  try {
    const endpoint = `${apiBaseUrl}/api/search?keyword=${encodeURI(keyword)}`;
    const data = await axios.get(endpoint);
    return data.data as Search;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Noo, something went wrong, relax it's not your fault ( ˶ˆᗜˆ˵ )`
      );
    } else {
      throw new Error(`Hmm, you wrote it correctly, right?  (╭ರ_•́)`);
    }
  }
};

export const getStream = async (
  id: string,
  type?: string,
  server?: string
): Promise<{ servers: Servers; stream: Stream }> => {
  try {
    const serversEndpoint = `${apiBaseUrl}/api/servers/${id}`;
    const serversData: Servers = (await axios.get<Servers>(serversEndpoint))
      .data;
    const filteredServer = serversData.results.find(
      (result) =>
        result.type === (type ?? "sub") &&
        result.serverName === (server ?? "hd-3")
    );

    const selectedServer = filteredServer || serversData.results[0];
    const streamEndpoint = `${apiBaseUrl}/api/stream?id=${id}&server=${selectedServer.serverName}&type=${selectedServer.type}`;
    const streamData: Stream = (await axios.get<Stream>(streamEndpoint)).data;

    return { servers: serversData, stream: streamData };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Noo, something went wrong, relax it's not your fault ( ˶ˆᗜˆ˵ )`
      );
    } else {
      throw new Error(`Hmm, you do it correctly, right?  (╭ರ_•́)`);
    }
  }
};

export const getSchedule = async (): Promise<Schedule[]> => {
  let schedules: Schedule[] = [];
  const today = new Date();

  try {
    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      const year = nextDate.getFullYear();
      const month = String(nextDate.getMonth() + 1).padStart(2, "0");
      const day = String(nextDate.getDate()).padStart(2, "0");
      const endpoint = `${apiBaseUrl}/api/schedule?date=${year}-${month}-${day}`;
      const data: Schedule = (await axios.get<Schedule>(endpoint)).data;
      schedules.push(data);
    }
    return schedules;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Noo, something went wrong, relax it's not your fault ( ˶ˆᗜˆ˵ )`
      );
    } else {
      throw new Error(`Hmm, you do it correctly, right?  (╭ರ_•́)`);
    }
  }
};

export const getCategory = async (
  category: string,
  page: number = 1
): Promise<Category> => {
  try {
    const endpoint = `${apiBaseUrl}/api/${category}?page=${page}`;
    const data = await axios.get(endpoint);
    return data.data as Category;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Noo, something went wrong, relax it's not your fault ( ˶ˆᗜˆ˵ )`
      );
    } else {
      throw new Error(`Hmm, you wrote it correctly, right?  (╭ರ_•́)`);
    }
  }
};
