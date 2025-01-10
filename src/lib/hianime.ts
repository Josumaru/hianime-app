"use server";
import { Episodes } from "@/types/episodes";
import { Hianime } from "@/types/hianime";
import { Info } from "@/types/info";
import { Search } from "@/types/search";
import { Stream } from "@/types/stream";
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
      throw new Error(`No episodes? hmmm I don't know either. btw ${error.message} -_-`);
    } else {
      throw new Error(`You don't have to be sad, developers make it more sad ૮(˶ㅠ︿ㅠ)ა`);
    }
  }
};

export const getSearch = async (keyword: string): Promise<Search> => {
  try {
    const endpoint = `${apiBaseUrl}/api/search?keyword=${encodeURI(keyword)}`
    const data = await axios.get(endpoint);
    return data.data as Search;
  } catch (error: any) {
    if(axios.isAxiosError(error)) {
      throw new Error(`Noo, something went wrong, relax it's not your fault ( ˶ˆᗜˆ˵ )`);
    } else {
      throw new Error(`Hmm, you wrote it correctly, right?  (╭ರ_•́)`);
    }
  }
}


export const getStream = async (id: string): Promise<Stream> => {
  try {
    const endpoint = `${apiBaseUrl}/api/stream?id=${id}&server=hd-1&type=sub`
    const data = await axios.get(endpoint);
    return data.data as Stream;
  } catch (error) {
    if(axios.isAxiosError(error)) {
      throw new Error(`Noo, something went wrong, relax it's not your fault ( ˶ˆᗜˆ˵ )`);
    } else {
      throw new Error(`Hmm, you do it correctly, right?  (╭ರ_•́)`);
    }
  }
}
