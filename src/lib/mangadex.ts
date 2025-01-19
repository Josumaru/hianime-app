"use server";
import { MangadexChapter } from "@/types/manga/chapter";
import { MangadexChapterImage } from "@/types/manga/chapter-image";
import { MangadexDetail } from "@/types/manga/detail";
import { MangadexFeed } from "@/types/manga/feed";
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
    throw new Error("Oh hell, Something went wrong (◡︵◡)");
  }
};

export const getMangadexDetail = async (
  id: string
): Promise<MangadexDetail> => {
  try {
    const endpoint = `${baseUrl}/manga/${id}?includes[]=cover_art&includes[]=manga&includes[]=author&includes[]=artist&includes[]=tag&includes[]=creator`;
    const response = await axios.get<MangadexDetail>(endpoint);
    return response.data;
  } catch (error) {
    throw new Error("Oh hell, Something went wrong (◡︵◡)");
  }
};

export const getManagdexFeed = async (id: string): Promise<MangadexFeed> => {
  try {
    const endpoint = `${baseUrl}/manga/${id}/feed?limit=499&order[volume]=asc&order[chapter]=asc`;
    console.log(endpoint);

    const response = await axios.get<MangadexFeed>(endpoint);
    return response.data;
  } catch (error) {
    throw new Error("Oh hell, Something went wrong (◡︵◡)");
  }
};

export const getMangadexChapterImage = async (
  id: string
): Promise<MangadexChapterImage> => {
  try {
    const endpoint = `${baseUrl}/at-home/server/${id}?forcePort443=true`;
    const response = await axios.get<MangadexChapterImage>(endpoint);
    return response.data;
  } catch (error) {
    throw new Error("Oh hell, Something went wrong (◡︵◡)");
  }
};

const data = {
  result: "ok",
  response: "collection",
  data: [
    {
      id: "b91a66a3-c842-468b-aacc-3535b0fa542a",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "1",
        title: null,
        translatedLanguage: "es-la",
        externalUrl: null,
        publishAt: "2022-09-15T01:15:02+00:00",
        readableAt: "2022-09-15T01:15:02+00:00",
        createdAt: "2022-09-15T01:15:02+00:00",
        updatedAt: "2022-10-13T02:49:51+00:00",
        pages: 35,
        version: 4,
      },
      relationships: [
        {
          id: "9c89b77b-5dc4-41f5-bb61-72304d68ee08",
          type: "scanlation_group",
        },
        {
          id: "bd6bb1bc-e295-4b4a-9c13-978c8c39541b",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "36140b99-9b4c-4b41-bc20-8b5dd6256dd7",
          type: "user",
        },
      ],
    },
    {
      id: "9d86c5d1-c17a-4980-8a81-0f21827cb046",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "1",
        title: null,
        translatedLanguage: "vi",
        externalUrl: null,
        publishAt: "2024-10-06T09:10:41+00:00",
        readableAt: "2024-10-06T09:10:41+00:00",
        createdAt: "2024-10-06T09:10:40+00:00",
        updatedAt: "2024-10-06T20:44:05+00:00",
        pages: 35,
        version: 5,
      },
      relationships: [
        {
          id: "48089f06-3257-41a4-909a-c554ef2397ec",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "c2966c8c-8415-417f-8180-00d13f8b5069",
          type: "user",
        },
      ],
    },
    {
      id: "751eaff9-7962-41ae-be0a-8550f8fecf11",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "1",
        title: null,
        translatedLanguage: "id",
        externalUrl: null,
        publishAt: "2022-07-14T05:03:14+00:00",
        readableAt: "2022-07-14T05:03:14+00:00",
        createdAt: "2022-07-14T05:03:14+00:00",
        updatedAt: "2022-10-13T02:49:48+00:00",
        pages: 36,
        version: 4,
      },
      relationships: [
        {
          id: "396c08d3-ea0f-4c4f-9752-78a51ea5d080",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "7ef24527-5d1f-4d5e-b6f4-5d9107e83ac8",
          type: "user",
        },
      ],
    },
    {
      id: "f20bbb34-f638-4c81-84d9-6ef18cad5c97",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "1",
        title: "Escrito no coração",
        translatedLanguage: "pt-br",
        externalUrl: null,
        publishAt: "2022-09-16T23:46:47+00:00",
        readableAt: "2022-09-16T23:46:47+00:00",
        createdAt: "2022-09-16T23:46:47+00:00",
        updatedAt: "2022-09-16T23:47:03+00:00",
        pages: 38,
        version: 3,
      },
      relationships: [
        {
          id: "337fbc53-711c-4942-987e-6aa0f6989df3",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "f8141f68-0d8c-4a48-86f5-8161201d6abd",
          type: "user",
        },
      ],
    },
    {
      id: "d5100a59-96bf-4ff3-9855-5bf9add67d23",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "1",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2021-11-21T07:13:36+00:00",
        readableAt: "2021-11-21T07:13:36+00:00",
        createdAt: "2021-11-21T07:13:35+00:00",
        updatedAt: "2022-06-25T03:19:48+00:00",
        pages: 39,
        version: 4,
      },
      relationships: [
        {
          id: "1dde9054-11fd-4f5e-a575-a50f7bd22d5f",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "7b90351b-cee5-4f57-a697-da43578f1330",
          type: "user",
        },
      ],
    },
    {
      id: "9d6ec0ca-914b-4f87-8292-893f306e4e06",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "1",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2021-10-10T08:36:07+00:00",
        readableAt: "2021-10-10T08:36:07+00:00",
        createdAt: "2021-10-10T08:36:07+00:00",
        updatedAt: "2022-06-25T03:19:47+00:00",
        pages: 37,
        version: 5,
      },
      relationships: [
        {
          id: "7c202055-8875-4afa-9d4e-c69235d610e6",
          type: "scanlation_group",
        },
        {
          id: "a55a2651-b040-45fd-9f00-4494d6e0ebc6",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "201324f7-c7a5-4ca7-83bb-41b28a1fd913",
          type: "user",
        },
      ],
    },
    {
      id: "0dbf0092-6969-4b85-8880-a7f8d00b5ff5",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "2",
        title: null,
        translatedLanguage: "id",
        externalUrl: null,
        publishAt: "2022-07-14T05:06:05+00:00",
        readableAt: "2022-07-14T05:06:05+00:00",
        createdAt: "2022-07-14T05:06:05+00:00",
        updatedAt: "2022-10-13T02:49:48+00:00",
        pages: 31,
        version: 4,
      },
      relationships: [
        {
          id: "396c08d3-ea0f-4c4f-9752-78a51ea5d080",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "7ef24527-5d1f-4d5e-b6f4-5d9107e83ac8",
          type: "user",
        },
      ],
    },
    {
      id: "88926887-9157-45fc-acdd-98062b756169",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "2",
        title: null,
        translatedLanguage: "pt-br",
        externalUrl: null,
        publishAt: "2022-09-16T23:47:31+00:00",
        readableAt: "2022-09-16T23:47:31+00:00",
        createdAt: "2022-09-16T23:47:31+00:00",
        updatedAt: "2022-09-16T23:47:41+00:00",
        pages: 32,
        version: 3,
      },
      relationships: [
        {
          id: "337fbc53-711c-4942-987e-6aa0f6989df3",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "f8141f68-0d8c-4a48-86f5-8161201d6abd",
          type: "user",
        },
      ],
    },
    {
      id: "6d76d018-1426-478f-90c3-17476ac5c096",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "2",
        title: null,
        translatedLanguage: "vi",
        externalUrl: null,
        publishAt: "2024-10-06T09:10:56+00:00",
        readableAt: "2024-10-06T09:10:56+00:00",
        createdAt: "2024-10-06T09:10:54+00:00",
        updatedAt: "2024-10-06T20:44:05+00:00",
        pages: 31,
        version: 5,
      },
      relationships: [
        {
          id: "48089f06-3257-41a4-909a-c554ef2397ec",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "c2966c8c-8415-417f-8180-00d13f8b5069",
          type: "user",
        },
      ],
    },
    {
      id: "6c26ae67-47da-46d0-83a0-c40fcad58eef",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "2.1",
        title: null,
        translatedLanguage: "es-la",
        externalUrl: null,
        publishAt: "2022-09-15T01:18:52+00:00",
        readableAt: "2022-09-15T01:18:52+00:00",
        createdAt: "2022-09-15T01:18:51+00:00",
        updatedAt: "2022-10-13T02:49:51+00:00",
        pages: 21,
        version: 4,
      },
      relationships: [
        {
          id: "9c89b77b-5dc4-41f5-bb61-72304d68ee08",
          type: "scanlation_group",
        },
        {
          id: "bd6bb1bc-e295-4b4a-9c13-978c8c39541b",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "36140b99-9b4c-4b41-bc20-8b5dd6256dd7",
          type: "user",
        },
      ],
    },
    {
      id: "f12b57a2-c85b-4f87-b41a-3fcf43f93e20",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "2.1",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2021-11-21T07:17:55+00:00",
        readableAt: "2021-11-21T07:17:55+00:00",
        createdAt: "2021-11-21T07:17:54+00:00",
        updatedAt: "2022-06-25T03:19:48+00:00",
        pages: 23,
        version: 4,
      },
      relationships: [
        {
          id: "1dde9054-11fd-4f5e-a575-a50f7bd22d5f",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "7b90351b-cee5-4f57-a697-da43578f1330",
          type: "user",
        },
      ],
    },
    {
      id: "9b293ef8-650f-4f63-a389-b5f21a6be206",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "2.1",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2021-10-24T21:42:03+00:00",
        readableAt: "2021-10-24T21:42:03+00:00",
        createdAt: "2021-10-24T21:42:03+00:00",
        updatedAt: "2022-06-25T03:19:47+00:00",
        pages: 19,
        version: 5,
      },
      relationships: [
        {
          id: "a55a2651-b040-45fd-9f00-4494d6e0ebc6",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "201324f7-c7a5-4ca7-83bb-41b28a1fd913",
          type: "user",
        },
      ],
    },
    {
      id: "c0d0bbfe-3f18-4378-8225-3a9073b11b28",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "2.2",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2021-12-04T17:50:57+00:00",
        readableAt: "2021-12-04T17:50:57+00:00",
        createdAt: "2021-12-04T17:50:56+00:00",
        updatedAt: "2022-06-25T03:19:50+00:00",
        pages: 17,
        version: 5,
      },
      relationships: [
        {
          id: "a55a2651-b040-45fd-9f00-4494d6e0ebc6",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "201324f7-c7a5-4ca7-83bb-41b28a1fd913",
          type: "user",
        },
      ],
    },
    {
      id: "f0844016-a467-4e3f-9f78-a365ff13a21e",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "2.2",
        title: null,
        translatedLanguage: "es-la",
        externalUrl: null,
        publishAt: "2022-09-15T01:19:50+00:00",
        readableAt: "2022-09-15T01:19:50+00:00",
        createdAt: "2022-09-15T01:19:50+00:00",
        updatedAt: "2022-10-13T02:49:52+00:00",
        pages: 10,
        version: 4,
      },
      relationships: [
        {
          id: "9c89b77b-5dc4-41f5-bb61-72304d68ee08",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "36140b99-9b4c-4b41-bc20-8b5dd6256dd7",
          type: "user",
        },
      ],
    },
    {
      id: "b1d83225-ad15-4f41-9fd4-9c1efff7195c",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "2.2",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2021-11-21T07:19:27+00:00",
        readableAt: "2021-11-21T07:19:27+00:00",
        createdAt: "2021-11-21T07:19:26+00:00",
        updatedAt: "2022-06-25T03:19:49+00:00",
        pages: 11,
        version: 4,
      },
      relationships: [
        {
          id: "1dde9054-11fd-4f5e-a575-a50f7bd22d5f",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "7b90351b-cee5-4f57-a697-da43578f1330",
          type: "user",
        },
      ],
    },
    {
      id: "6927bedf-d9a6-4940-8e9d-cd069b4d51f1",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "3",
        title: null,
        translatedLanguage: "id",
        externalUrl: null,
        publishAt: "2022-07-14T05:07:43+00:00",
        readableAt: "2022-07-14T05:07:43+00:00",
        createdAt: "2022-07-14T05:07:43+00:00",
        updatedAt: "2022-10-13T02:49:49+00:00",
        pages: 14,
        version: 4,
      },
      relationships: [
        {
          id: "396c08d3-ea0f-4c4f-9752-78a51ea5d080",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "7ef24527-5d1f-4d5e-b6f4-5d9107e83ac8",
          type: "user",
        },
      ],
    },
    {
      id: "429db614-ad78-45a7-8a3d-907ab5961813",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "3",
        title: null,
        translatedLanguage: "vi",
        externalUrl: null,
        publishAt: "2024-10-06T09:11:29+00:00",
        readableAt: "2024-10-06T09:11:29+00:00",
        createdAt: "2024-10-06T09:11:28+00:00",
        updatedAt: "2024-10-06T20:44:05+00:00",
        pages: 30,
        version: 4,
      },
      relationships: [
        {
          id: "48089f06-3257-41a4-909a-c554ef2397ec",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "c2966c8c-8415-417f-8180-00d13f8b5069",
          type: "user",
        },
      ],
    },
    {
      id: "fcd0e92e-662e-484c-8d3a-87b8c2d90668",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "3",
        title: null,
        translatedLanguage: "pt-br",
        externalUrl: null,
        publishAt: "2022-09-17T00:01:05+00:00",
        readableAt: "2022-09-17T00:01:05+00:00",
        createdAt: "2022-09-17T00:01:04+00:00",
        updatedAt: "2022-09-17T00:08:28+00:00",
        pages: 30,
        version: 4,
      },
      relationships: [
        {
          id: "337fbc53-711c-4942-987e-6aa0f6989df3",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "f8141f68-0d8c-4a48-86f5-8161201d6abd",
          type: "user",
        },
      ],
    },
    {
      id: "193fa070-439a-444a-8e21-c9fc69343cb5",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "3.1",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2022-01-05T13:41:19+00:00",
        readableAt: "2022-01-05T13:41:19+00:00",
        createdAt: "2022-01-05T13:41:19+00:00",
        updatedAt: "2022-06-25T03:19:54+00:00",
        pages: 11,
        version: 5,
      },
      relationships: [
        {
          id: "1dde9054-11fd-4f5e-a575-a50f7bd22d5f",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "7b90351b-cee5-4f57-a697-da43578f1330",
          type: "user",
        },
      ],
    },
    {
      id: "475a3976-46af-4de5-bd05-3ffd274d6031",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "3.1",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2021-12-04T18:01:13+00:00",
        readableAt: "2021-12-04T18:01:13+00:00",
        createdAt: "2021-12-04T18:01:13+00:00",
        updatedAt: "2022-06-25T03:19:50+00:00",
        pages: 15,
        version: 5,
      },
      relationships: [
        {
          id: "a55a2651-b040-45fd-9f00-4494d6e0ebc6",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "201324f7-c7a5-4ca7-83bb-41b28a1fd913",
          type: "user",
        },
      ],
    },
    {
      id: "849ebeb1-e0fa-4adc-bc42-8cb26a1e4595",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "3.1",
        title: null,
        translatedLanguage: "es-la",
        externalUrl: null,
        publishAt: "2022-09-15T01:20:46+00:00",
        readableAt: "2022-09-15T01:20:46+00:00",
        createdAt: "2022-09-15T01:20:46+00:00",
        updatedAt: "2022-10-13T02:49:52+00:00",
        pages: 11,
        version: 4,
      },
      relationships: [
        {
          id: "9c89b77b-5dc4-41f5-bb61-72304d68ee08",
          type: "scanlation_group",
        },
        {
          id: "bd6bb1bc-e295-4b4a-9c13-978c8c39541b",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "36140b99-9b4c-4b41-bc20-8b5dd6256dd7",
          type: "user",
        },
      ],
    },
    {
      id: "c4c624c3-5313-4688-83bb-9f7eaa752ff5",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "3.2",
        title: null,
        translatedLanguage: "es-la",
        externalUrl: null,
        publishAt: "2022-09-15T01:21:56+00:00",
        readableAt: "2022-09-15T01:21:56+00:00",
        createdAt: "2022-09-15T01:21:55+00:00",
        updatedAt: "2022-10-13T02:49:52+00:00",
        pages: 18,
        version: 4,
      },
      relationships: [
        {
          id: "9c89b77b-5dc4-41f5-bb61-72304d68ee08",
          type: "scanlation_group",
        },
        {
          id: "bd6bb1bc-e295-4b4a-9c13-978c8c39541b",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "36140b99-9b4c-4b41-bc20-8b5dd6256dd7",
          type: "user",
        },
      ],
    },
    {
      id: "fdba574b-5c32-42c0-a114-1700d9153b54",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "3.2",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2022-03-30T16:18:39+00:00",
        readableAt: "2022-03-30T16:18:39+00:00",
        createdAt: "2022-03-30T16:18:39+00:00",
        updatedAt: "2022-06-25T03:19:56+00:00",
        pages: 21,
        version: 4,
      },
      relationships: [
        {
          id: "1dde9054-11fd-4f5e-a575-a50f7bd22d5f",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "7b90351b-cee5-4f57-a697-da43578f1330",
          type: "user",
        },
      ],
    },
    {
      id: "cd0f120b-fb2d-4d9a-b26c-680f5351108f",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "3.2",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2021-12-04T18:11:36+00:00",
        readableAt: "2021-12-04T18:11:36+00:00",
        createdAt: "2021-12-04T18:11:35+00:00",
        updatedAt: "2022-06-25T03:19:51+00:00",
        pages: 16,
        version: 5,
      },
      relationships: [
        {
          id: "a55a2651-b040-45fd-9f00-4494d6e0ebc6",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "201324f7-c7a5-4ca7-83bb-41b28a1fd913",
          type: "user",
        },
      ],
    },
    {
      id: "dfeb18e9-29f5-482c-8430-05257852e745",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "4",
        title: null,
        translatedLanguage: "pt-br",
        externalUrl: null,
        publishAt: "2022-09-17T00:01:40+00:00",
        readableAt: "2022-09-17T00:01:40+00:00",
        createdAt: "2022-09-17T00:01:40+00:00",
        updatedAt: "2022-09-17T00:02:01+00:00",
        pages: 33,
        version: 3,
      },
      relationships: [
        {
          id: "337fbc53-711c-4942-987e-6aa0f6989df3",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "f8141f68-0d8c-4a48-86f5-8161201d6abd",
          type: "user",
        },
      ],
    },
    {
      id: "abe7e3e6-56bc-4911-a61b-36c0f66a969d",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "4",
        title: null,
        translatedLanguage: "vi",
        externalUrl: null,
        publishAt: "2024-10-06T09:11:56+00:00",
        readableAt: "2024-10-06T09:11:56+00:00",
        createdAt: "2024-10-06T09:11:56+00:00",
        updatedAt: "2024-10-06T20:44:06+00:00",
        pages: 32,
        version: 4,
      },
      relationships: [
        {
          id: "48089f06-3257-41a4-909a-c554ef2397ec",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "c2966c8c-8415-417f-8180-00d13f8b5069",
          type: "user",
        },
      ],
    },
    {
      id: "bae1bdd4-2c72-4753-bcd0-43a5118ea2ca",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "4",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2021-12-16T15:12:02+00:00",
        readableAt: "2021-12-16T15:12:02+00:00",
        createdAt: "2021-12-16T15:12:02+00:00",
        updatedAt: "2022-06-25T03:19:52+00:00",
        pages: 36,
        version: 5,
      },
      relationships: [
        {
          id: "a55a2651-b040-45fd-9f00-4494d6e0ebc6",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "abc43aa5-b86c-4759-ade1-b54c654194fb",
          type: "user",
        },
      ],
    },
    {
      id: "0a91ff17-8d58-4809-a5f6-68d9cadb99ee",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "4",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2022-03-30T16:22:16+00:00",
        readableAt: "2022-03-30T16:22:16+00:00",
        createdAt: "2022-03-30T16:22:16+00:00",
        updatedAt: "2023-02-16T09:20:53+00:00",
        pages: 34,
        version: 6,
      },
      relationships: [
        {
          id: "1dde9054-11fd-4f5e-a575-a50f7bd22d5f",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "7b90351b-cee5-4f57-a697-da43578f1330",
          type: "user",
        },
      ],
    },
    {
      id: "4d8f0810-5761-4e15-95f1-ae081a3a98da",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "4",
        title: null,
        translatedLanguage: "id",
        externalUrl: null,
        publishAt: "2022-07-14T05:09:23+00:00",
        readableAt: "2022-07-14T05:09:23+00:00",
        createdAt: "2022-07-14T05:09:23+00:00",
        updatedAt: "2022-10-13T02:49:49+00:00",
        pages: 32,
        version: 4,
      },
      relationships: [
        {
          id: "396c08d3-ea0f-4c4f-9752-78a51ea5d080",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "7ef24527-5d1f-4d5e-b6f4-5d9107e83ac8",
          type: "user",
        },
      ],
    },
    {
      id: "808dd8c5-dba1-4e81-bc37-6d5320d2d816",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "4",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2021-12-12T04:34:27+00:00",
        readableAt: "2021-12-12T04:34:27+00:00",
        createdAt: "2021-12-12T04:34:27+00:00",
        updatedAt: "2022-06-25T03:19:51+00:00",
        pages: 31,
        version: 5,
      },
      relationships: [
        {
          id: "4f8d7a14-9a80-4f02-aad9-5049ba2bf144",
          type: "scanlation_group",
        },
        {
          id: "7c202055-8875-4afa-9d4e-c69235d610e6",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "3568f908-b4f6-4629-9352-8fe1c269727b",
          type: "user",
        },
      ],
    },
    {
      id: "3d9f19a3-4de2-48d8-9827-7fa28d98f2d9",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "4.1",
        title: null,
        translatedLanguage: "es-la",
        externalUrl: null,
        publishAt: "2022-09-15T01:22:56+00:00",
        readableAt: "2022-09-15T01:22:56+00:00",
        createdAt: "2022-09-15T01:22:56+00:00",
        updatedAt: "2022-10-13T02:49:53+00:00",
        pages: 13,
        version: 4,
      },
      relationships: [
        {
          id: "9c89b77b-5dc4-41f5-bb61-72304d68ee08",
          type: "scanlation_group",
        },
        {
          id: "bd6bb1bc-e295-4b4a-9c13-978c8c39541b",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "36140b99-9b4c-4b41-bc20-8b5dd6256dd7",
          type: "user",
        },
      ],
    },
    {
      id: "ab4be52d-d2a1-4b7b-879d-5a0f197a724c",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "4.2",
        title: null,
        translatedLanguage: "es-la",
        externalUrl: null,
        publishAt: "2022-09-15T01:24:22+00:00",
        readableAt: "2022-09-15T01:24:22+00:00",
        createdAt: "2022-09-15T01:24:22+00:00",
        updatedAt: "2022-10-13T02:49:53+00:00",
        pages: 19,
        version: 4,
      },
      relationships: [
        {
          id: "9c89b77b-5dc4-41f5-bb61-72304d68ee08",
          type: "scanlation_group",
        },
        {
          id: "bd6bb1bc-e295-4b4a-9c13-978c8c39541b",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "36140b99-9b4c-4b41-bc20-8b5dd6256dd7",
          type: "user",
        },
      ],
    },
    {
      id: "93319ef8-66ea-4fcf-a99a-ddd8f1347f6b",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "5",
        title: null,
        translatedLanguage: "id",
        externalUrl: null,
        publishAt: "2022-07-14T05:11:13+00:00",
        readableAt: "2022-07-14T05:11:13+00:00",
        createdAt: "2022-07-14T05:11:13+00:00",
        updatedAt: "2022-10-13T02:49:50+00:00",
        pages: 35,
        version: 4,
      },
      relationships: [
        {
          id: "396c08d3-ea0f-4c4f-9752-78a51ea5d080",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "7ef24527-5d1f-4d5e-b6f4-5d9107e83ac8",
          type: "user",
        },
      ],
    },
    {
      id: "62e1f459-a02b-4ffa-bd94-be9180521fb7",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "5",
        title: null,
        translatedLanguage: "pt-br",
        externalUrl: null,
        publishAt: "2022-09-17T00:02:30+00:00",
        readableAt: "2022-09-17T00:02:30+00:00",
        createdAt: "2022-09-17T00:02:30+00:00",
        updatedAt: "2022-09-17T00:02:47+00:00",
        pages: 36,
        version: 3,
      },
      relationships: [
        {
          id: "337fbc53-711c-4942-987e-6aa0f6989df3",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "f8141f68-0d8c-4a48-86f5-8161201d6abd",
          type: "user",
        },
      ],
    },
    {
      id: "b7eec5d7-1779-481b-96b2-8a37c9cc945a",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "5.1",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2021-12-16T15:15:32+00:00",
        readableAt: "2021-12-16T15:15:32+00:00",
        createdAt: "2021-12-16T15:15:32+00:00",
        updatedAt: "2022-06-25T03:19:53+00:00",
        pages: 23,
        version: 5,
      },
      relationships: [
        {
          id: "a55a2651-b040-45fd-9f00-4494d6e0ebc6",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "abc43aa5-b86c-4759-ade1-b54c654194fb",
          type: "user",
        },
      ],
    },
    {
      id: "7c00c7dd-4eb5-4601-b409-5221023639b9",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "5.1",
        title: null,
        translatedLanguage: "vi",
        externalUrl: null,
        publishAt: "2024-10-06T09:12:06+00:00",
        readableAt: "2024-10-06T09:12:06+00:00",
        createdAt: "2024-10-06T09:12:05+00:00",
        updatedAt: "2024-10-06T20:44:06+00:00",
        pages: 20,
        version: 5,
      },
      relationships: [
        {
          id: "48089f06-3257-41a4-909a-c554ef2397ec",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "c2966c8c-8415-417f-8180-00d13f8b5069",
          type: "user",
        },
      ],
    },
    {
      id: "0d58cd73-d6ba-4913-a0ac-7b8e129e2bdd",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "5.1",
        title: null,
        translatedLanguage: "es-la",
        externalUrl: null,
        publishAt: "2022-09-15T01:25:34+00:00",
        readableAt: "2022-09-15T01:25:34+00:00",
        createdAt: "2022-09-15T01:25:33+00:00",
        updatedAt: "2022-10-13T02:49:54+00:00",
        pages: 20,
        version: 4,
      },
      relationships: [
        {
          id: "9c89b77b-5dc4-41f5-bb61-72304d68ee08",
          type: "scanlation_group",
        },
        {
          id: "bd6bb1bc-e295-4b4a-9c13-978c8c39541b",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "36140b99-9b4c-4b41-bc20-8b5dd6256dd7",
          type: "user",
        },
      ],
    },
    {
      id: "431c196a-3a1c-47a7-8ed6-7c1219c0ea50",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "5.2",
        title: null,
        translatedLanguage: "es-la",
        externalUrl: null,
        publishAt: "2022-09-15T01:26:46+00:00",
        readableAt: "2022-09-15T01:26:46+00:00",
        createdAt: "2022-09-15T01:26:45+00:00",
        updatedAt: "2022-10-13T02:49:54+00:00",
        pages: 18,
        version: 4,
      },
      relationships: [
        {
          id: "9c89b77b-5dc4-41f5-bb61-72304d68ee08",
          type: "scanlation_group",
        },
        {
          id: "bd6bb1bc-e295-4b4a-9c13-978c8c39541b",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "36140b99-9b4c-4b41-bc20-8b5dd6256dd7",
          type: "user",
        },
      ],
    },
    {
      id: "fabda328-302f-4e80-8c1a-0c4418e47760",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "5.2",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2021-12-16T15:21:15+00:00",
        readableAt: "2021-12-16T15:21:15+00:00",
        createdAt: "2021-12-16T15:21:15+00:00",
        updatedAt: "2022-06-25T03:19:53+00:00",
        pages: 23,
        version: 5,
      },
      relationships: [
        {
          id: "a55a2651-b040-45fd-9f00-4494d6e0ebc6",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "abc43aa5-b86c-4759-ade1-b54c654194fb",
          type: "user",
        },
      ],
    },
    {
      id: "a82d8378-ce7f-4384-a6f1-613ba9c730ef",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "5.2",
        title: null,
        translatedLanguage: "vi",
        externalUrl: null,
        publishAt: "2024-10-06T09:17:10+00:00",
        readableAt: "2024-10-06T09:17:10+00:00",
        createdAt: "2024-10-06T09:17:10+00:00",
        updatedAt: "2024-10-06T20:44:07+00:00",
        pages: 19,
        version: 4,
      },
      relationships: [
        {
          id: "48089f06-3257-41a4-909a-c554ef2397ec",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "c2966c8c-8415-417f-8180-00d13f8b5069",
          type: "user",
        },
      ],
    },
    {
      id: "2af8772c-ed29-4472-877f-bad1eec9de13",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "6",
        title: null,
        translatedLanguage: "es-la",
        externalUrl: null,
        publishAt: "2022-09-15T01:28:32+00:00",
        readableAt: "2022-09-15T01:28:32+00:00",
        createdAt: "2022-09-15T01:28:32+00:00",
        updatedAt: "2022-10-13T02:49:55+00:00",
        pages: 40,
        version: 4,
      },
      relationships: [
        {
          id: "9c89b77b-5dc4-41f5-bb61-72304d68ee08",
          type: "scanlation_group",
        },
        {
          id: "bd6bb1bc-e295-4b4a-9c13-978c8c39541b",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "36140b99-9b4c-4b41-bc20-8b5dd6256dd7",
          type: "user",
        },
      ],
    },
    {
      id: "eccbda9a-bc72-4bd2-99d2-4a187abaef77",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "6",
        title: null,
        translatedLanguage: "pt-br",
        externalUrl: null,
        publishAt: "2022-09-17T00:03:12+00:00",
        readableAt: "2022-09-17T00:03:12+00:00",
        createdAt: "2022-09-17T00:03:12+00:00",
        updatedAt: "2022-09-17T00:03:34+00:00",
        pages: 40,
        version: 3,
      },
      relationships: [
        {
          id: "337fbc53-711c-4942-987e-6aa0f6989df3",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "f8141f68-0d8c-4a48-86f5-8161201d6abd",
          type: "user",
        },
      ],
    },
    {
      id: "69e0d317-4cd0-406a-9922-a9b6b0dd7977",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "6",
        title: null,
        translatedLanguage: "vi",
        externalUrl: null,
        publishAt: "2024-10-06T09:17:35+00:00",
        readableAt: "2024-10-06T09:17:35+00:00",
        createdAt: "2024-10-06T09:17:35+00:00",
        updatedAt: "2024-10-06T20:44:07+00:00",
        pages: 40,
        version: 4,
      },
      relationships: [
        {
          id: "48089f06-3257-41a4-909a-c554ef2397ec",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "c2966c8c-8415-417f-8180-00d13f8b5069",
          type: "user",
        },
      ],
    },
    {
      id: "32542bb8-b927-4b54-9235-8bda498d28c9",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "6",
        title: null,
        translatedLanguage: "id",
        externalUrl: null,
        publishAt: "2022-07-14T05:12:15+00:00",
        readableAt: "2022-07-14T05:12:15+00:00",
        createdAt: "2022-07-14T05:12:14+00:00",
        updatedAt: "2022-10-13T02:49:50+00:00",
        pages: 39,
        version: 4,
      },
      relationships: [
        {
          id: "396c08d3-ea0f-4c4f-9752-78a51ea5d080",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "7ef24527-5d1f-4d5e-b6f4-5d9107e83ac8",
          type: "user",
        },
      ],
    },
    {
      id: "a843f4df-78b9-47b5-b7ce-101ae93b869e",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "6.1",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2022-01-20T16:11:48+00:00",
        readableAt: "2022-01-20T16:11:48+00:00",
        createdAt: "2022-01-20T16:11:37+00:00",
        updatedAt: "2022-06-25T03:19:54+00:00",
        pages: 20,
        version: 5,
      },
      relationships: [
        {
          id: "a55a2651-b040-45fd-9f00-4494d6e0ebc6",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "abc43aa5-b86c-4759-ade1-b54c654194fb",
          type: "user",
        },
      ],
    },
    {
      id: "b7bb82e6-de77-4bd6-b657-dbc57e07e213",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "6.2",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2022-01-29T04:10:30+00:00",
        readableAt: "2022-01-29T04:10:30+00:00",
        createdAt: "2022-01-29T04:10:30+00:00",
        updatedAt: "2023-03-27T00:25:56+00:00",
        pages: 22,
        version: 6,
      },
      relationships: [
        {
          id: "a55a2651-b040-45fd-9f00-4494d6e0ebc6",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "201324f7-c7a5-4ca7-83bb-41b28a1fd913",
          type: "user",
        },
      ],
    },
    {
      id: "37cad846-16f6-4b04-a1b3-26434188a2ea",
      type: "chapter",
      attributes: {
        volume: "2",
        chapter: "7",
        title: null,
        translatedLanguage: "pt-br",
        externalUrl: null,
        publishAt: "2022-09-17T00:03:46+00:00",
        readableAt: "2022-09-17T00:03:46+00:00",
        createdAt: "2022-09-17T00:03:46+00:00",
        updatedAt: "2022-09-17T00:04:01+00:00",
        pages: 35,
        version: 3,
      },
      relationships: [
        {
          id: "337fbc53-711c-4942-987e-6aa0f6989df3",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "f8141f68-0d8c-4a48-86f5-8161201d6abd",
          type: "user",
        },
      ],
    },
    {
      id: "86025fa3-8398-475e-97d4-8c50d98ebce9",
      type: "chapter",
      attributes: {
        volume: "2",
        chapter: "7",
        title: null,
        translatedLanguage: "es-la",
        externalUrl: null,
        publishAt: "2022-09-15T01:29:53+00:00",
        readableAt: "2022-09-15T01:29:53+00:00",
        createdAt: "2022-09-15T01:29:52+00:00",
        updatedAt: "2022-10-13T02:50:08+00:00",
        pages: 35,
        version: 4,
      },
      relationships: [
        {
          id: "9c89b77b-5dc4-41f5-bb61-72304d68ee08",
          type: "scanlation_group",
        },
        {
          id: "bd6bb1bc-e295-4b4a-9c13-978c8c39541b",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "36140b99-9b4c-4b41-bc20-8b5dd6256dd7",
          type: "user",
        },
      ],
    },
    {
      id: "fcac3958-a25d-4c1e-8803-5b3adc3363e9",
      type: "chapter",
      attributes: {
        volume: "2",
        chapter: "7",
        title: null,
        translatedLanguage: "id",
        externalUrl: null,
        publishAt: "2022-07-14T05:13:34+00:00",
        readableAt: "2022-07-14T05:13:34+00:00",
        createdAt: "2022-07-14T05:13:34+00:00",
        updatedAt: "2022-10-13T02:50:06+00:00",
        pages: 34,
        version: 4,
      },
      relationships: [
        {
          id: "396c08d3-ea0f-4c4f-9752-78a51ea5d080",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "7ef24527-5d1f-4d5e-b6f4-5d9107e83ac8",
          type: "user",
        },
      ],
    },
    {
      id: "e781a638-d425-4303-8838-18828156bc7b",
      type: "chapter",
      attributes: {
        volume: "2",
        chapter: "7",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2022-05-01T17:24:03+00:00",
        readableAt: "2022-05-01T17:24:03+00:00",
        createdAt: "2022-05-01T17:24:03+00:00",
        updatedAt: "2022-06-27T12:06:00+00:00",
        pages: 36,
        version: 4,
      },
      relationships: [
        {
          id: "a55a2651-b040-45fd-9f00-4494d6e0ebc6",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "35eef282-bd5f-46da-a230-a86057dbb3ea",
          type: "user",
        },
      ],
    },
    {
      id: "60675f97-fb46-4b4d-b873-9d4381c3d61d",
      type: "chapter",
      attributes: {
        volume: "2",
        chapter: "7",
        title: null,
        translatedLanguage: "vi",
        externalUrl: null,
        publishAt: "2024-10-06T09:19:03+00:00",
        readableAt: "2024-10-06T09:19:03+00:00",
        createdAt: "2024-10-06T09:19:02+00:00",
        updatedAt: "2024-10-06T20:44:08+00:00",
        pages: 37,
        version: 5,
      },
      relationships: [
        {
          id: "48089f06-3257-41a4-909a-c554ef2397ec",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "c2966c8c-8415-417f-8180-00d13f8b5069",
          type: "user",
        },
      ],
    },
    {
      id: "6f586767-0063-412a-adbe-c5d753a1b2e6",
      type: "chapter",
      attributes: {
        volume: "2",
        chapter: "8",
        title: null,
        translatedLanguage: "pt-br",
        externalUrl: null,
        publishAt: "2022-09-17T00:04:34+00:00",
        readableAt: "2022-09-17T00:04:34+00:00",
        createdAt: "2022-09-17T00:04:34+00:00",
        updatedAt: "2022-09-17T00:04:50+00:00",
        pages: 32,
        version: 3,
      },
      relationships: [
        {
          id: "337fbc53-711c-4942-987e-6aa0f6989df3",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "f8141f68-0d8c-4a48-86f5-8161201d6abd",
          type: "user",
        },
      ],
    },
    {
      id: "879911dc-056c-4127-b036-9682179ef3b2",
      type: "chapter",
      attributes: {
        volume: "2",
        chapter: "8",
        title: null,
        translatedLanguage: "es-la",
        externalUrl: null,
        publishAt: "2022-09-15T01:31:11+00:00",
        readableAt: "2022-09-15T01:31:11+00:00",
        createdAt: "2022-09-15T01:31:11+00:00",
        updatedAt: "2022-10-13T02:50:09+00:00",
        pages: 31,
        version: 4,
      },
      relationships: [
        {
          id: "9c89b77b-5dc4-41f5-bb61-72304d68ee08",
          type: "scanlation_group",
        },
        {
          id: "bd6bb1bc-e295-4b4a-9c13-978c8c39541b",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "36140b99-9b4c-4b41-bc20-8b5dd6256dd7",
          type: "user",
        },
      ],
    },
    {
      id: "ba9d9a24-37c1-4ab4-9e8b-5de8398334b8",
      type: "chapter",
      attributes: {
        volume: "2",
        chapter: "8",
        title: null,
        translatedLanguage: "id",
        externalUrl: null,
        publishAt: "2022-07-14T05:15:39+00:00",
        readableAt: "2022-07-14T05:15:39+00:00",
        createdAt: "2022-07-14T05:15:39+00:00",
        updatedAt: "2022-10-13T02:50:06+00:00",
        pages: 33,
        version: 4,
      },
      relationships: [
        {
          id: "396c08d3-ea0f-4c4f-9752-78a51ea5d080",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "7ef24527-5d1f-4d5e-b6f4-5d9107e83ac8",
          type: "user",
        },
      ],
    },
    {
      id: "8d7b141b-2c7f-4e5d-9dbd-a8943e83ad7f",
      type: "chapter",
      attributes: {
        volume: "2",
        chapter: "8.1",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2022-11-12T02:48:56+00:00",
        readableAt: "2022-11-12T02:48:56+00:00",
        createdAt: "2022-11-12T02:48:56+00:00",
        updatedAt: "2024-05-17T20:11:42+00:00",
        pages: 20,
        version: 4,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "7d9caa18-e254-4f4b-a304-152d2f942fdb",
      type: "chapter",
      attributes: {
        volume: "2",
        chapter: "8.1",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2023-03-13T11:02:21+00:00",
        readableAt: "2023-03-13T11:02:21+00:00",
        createdAt: "2023-03-13T11:02:21+00:00",
        updatedAt: "2023-03-27T00:57:08+00:00",
        pages: 18,
        version: 5,
      },
      relationships: [
        {
          id: "a55a2651-b040-45fd-9f00-4494d6e0ebc6",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "201324f7-c7a5-4ca7-83bb-41b28a1fd913",
          type: "user",
        },
      ],
    },
    {
      id: "532852d1-dbdf-4fe8-9f35-9f8d7d949fd5",
      type: "chapter",
      attributes: {
        volume: "2",
        chapter: "8.2",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2023-03-13T11:11:19+00:00",
        readableAt: "2023-03-13T11:11:19+00:00",
        createdAt: "2023-03-13T11:11:18+00:00",
        updatedAt: "2023-03-27T00:57:11+00:00",
        pages: 20,
        version: 5,
      },
      relationships: [
        {
          id: "a55a2651-b040-45fd-9f00-4494d6e0ebc6",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "201324f7-c7a5-4ca7-83bb-41b28a1fd913",
          type: "user",
        },
      ],
    },
    {
      id: "9543578f-c3ea-4661-bfb2-b62674efc1ff",
      type: "chapter",
      attributes: {
        volume: "2",
        chapter: "8.2",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2022-11-12T02:49:14+00:00",
        readableAt: "2022-11-12T02:49:14+00:00",
        createdAt: "2022-11-12T02:49:13+00:00",
        updatedAt: "2024-05-17T20:16:36+00:00",
        pages: 14,
        version: 4,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "621966d2-6d22-49ba-8dfd-6ac52edf7ff4",
      type: "chapter",
      attributes: {
        volume: "2",
        chapter: "9",
        title: null,
        translatedLanguage: "es-la",
        externalUrl: null,
        publishAt: "2022-09-15T01:32:25+00:00",
        readableAt: "2022-09-15T01:32:25+00:00",
        createdAt: "2022-09-15T01:32:24+00:00",
        updatedAt: "2022-10-13T02:50:09+00:00",
        pages: 31,
        version: 4,
      },
      relationships: [
        {
          id: "9c89b77b-5dc4-41f5-bb61-72304d68ee08",
          type: "scanlation_group",
        },
        {
          id: "bd6bb1bc-e295-4b4a-9c13-978c8c39541b",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "36140b99-9b4c-4b41-bc20-8b5dd6256dd7",
          type: "user",
        },
      ],
    },
    {
      id: "f3e8b643-f259-4324-8629-6b7d9d3c7f18",
      type: "chapter",
      attributes: {
        volume: "2",
        chapter: "9",
        title: null,
        translatedLanguage: "id",
        externalUrl: null,
        publishAt: "2022-07-14T05:16:51+00:00",
        readableAt: "2022-07-14T05:16:51+00:00",
        createdAt: "2022-07-14T05:16:51+00:00",
        updatedAt: "2022-10-13T02:50:07+00:00",
        pages: 33,
        version: 4,
      },
      relationships: [
        {
          id: "396c08d3-ea0f-4c4f-9752-78a51ea5d080",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "7ef24527-5d1f-4d5e-b6f4-5d9107e83ac8",
          type: "user",
        },
      ],
    },
    {
      id: "e0567114-b1ab-4c74-b4ed-0ac91be9751d",
      type: "chapter",
      attributes: {
        volume: "2",
        chapter: "9",
        title: null,
        translatedLanguage: "pt-br",
        externalUrl: null,
        publishAt: "2022-09-17T00:06:03+00:00",
        readableAt: "2022-09-17T00:06:03+00:00",
        createdAt: "2022-09-17T00:06:03+00:00",
        updatedAt: "2022-09-17T00:06:10+00:00",
        pages: 32,
        version: 3,
      },
      relationships: [
        {
          id: "337fbc53-711c-4942-987e-6aa0f6989df3",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "f8141f68-0d8c-4a48-86f5-8161201d6abd",
          type: "user",
        },
      ],
    },
    {
      id: "e8a7cedc-9017-4c33-9101-54e155e857b2",
      type: "chapter",
      attributes: {
        volume: "2",
        chapter: "9",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2022-11-12T02:49:29+00:00",
        readableAt: "2022-11-12T02:49:29+00:00",
        createdAt: "2022-11-12T02:49:29+00:00",
        updatedAt: "2023-02-18T21:07:35+00:00",
        pages: 34,
        version: 5,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "d5f8f91e-59e9-44c1-9db4-fc83846e9f74",
      type: "chapter",
      attributes: {
        volume: "2",
        chapter: "10",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2023-02-15T11:35:34+00:00",
        readableAt: "2023-02-15T11:35:34+00:00",
        createdAt: "2023-02-15T11:35:32+00:00",
        updatedAt: "2023-02-15T11:37:33+00:00",
        pages: 27,
        version: 4,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "ffdd8844-65ef-4883-9948-269378420b9a",
      type: "chapter",
      attributes: {
        volume: "2",
        chapter: "10",
        title: null,
        translatedLanguage: "es-la",
        externalUrl: null,
        publishAt: "2022-09-15T01:33:52+00:00",
        readableAt: "2022-09-15T01:33:52+00:00",
        createdAt: "2022-09-15T01:33:51+00:00",
        updatedAt: "2022-10-13T02:50:09+00:00",
        pages: 26,
        version: 4,
      },
      relationships: [
        {
          id: "9c89b77b-5dc4-41f5-bb61-72304d68ee08",
          type: "scanlation_group",
        },
        {
          id: "bd6bb1bc-e295-4b4a-9c13-978c8c39541b",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "36140b99-9b4c-4b41-bc20-8b5dd6256dd7",
          type: "user",
        },
      ],
    },
    {
      id: "58af8f2b-c1cb-4c84-b33f-3b071be5698f",
      type: "chapter",
      attributes: {
        volume: "2",
        chapter: "10",
        title: null,
        translatedLanguage: "id",
        externalUrl: null,
        publishAt: "2022-07-14T05:18:23+00:00",
        readableAt: "2022-07-14T05:18:23+00:00",
        createdAt: "2022-07-14T05:18:23+00:00",
        updatedAt: "2022-10-13T02:50:07+00:00",
        pages: 25,
        version: 4,
      },
      relationships: [
        {
          id: "396c08d3-ea0f-4c4f-9752-78a51ea5d080",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "7ef24527-5d1f-4d5e-b6f4-5d9107e83ac8",
          type: "user",
        },
      ],
    },
    {
      id: "73557b00-e965-4eb2-9491-21aedd709f82",
      type: "chapter",
      attributes: {
        volume: "2",
        chapter: "10",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2023-02-15T02:47:25+00:00",
        readableAt: "2023-02-15T02:47:25+00:00",
        createdAt: "2023-02-15T02:47:25+00:00",
        updatedAt: "2023-02-18T21:08:32+00:00",
        pages: 29,
        version: 5,
      },
      relationships: [
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "2f211aec-6a6c-4933-8830-872262f62d4d",
          type: "user",
        },
      ],
    },
    {
      id: "51e3eaac-e4a0-4b29-936a-e68bd8adbbbc",
      type: "chapter",
      attributes: {
        volume: "2",
        chapter: "10",
        title: null,
        translatedLanguage: "pt-br",
        externalUrl: null,
        publishAt: "2022-09-17T00:06:37+00:00",
        readableAt: "2022-09-17T00:06:37+00:00",
        createdAt: "2022-09-17T00:06:36+00:00",
        updatedAt: "2022-09-17T00:06:54+00:00",
        pages: 26,
        version: 3,
      },
      relationships: [
        {
          id: "337fbc53-711c-4942-987e-6aa0f6989df3",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "f8141f68-0d8c-4a48-86f5-8161201d6abd",
          type: "user",
        },
      ],
    },
    {
      id: "5fadf6c5-4eae-4a11-8b58-787b5acf0151",
      type: "chapter",
      attributes: {
        volume: "2",
        chapter: "11",
        title: null,
        translatedLanguage: "id",
        externalUrl: null,
        publishAt: "2022-07-14T05:25:51+00:00",
        readableAt: "2022-07-14T05:25:51+00:00",
        createdAt: "2022-07-14T05:25:50+00:00",
        updatedAt: "2022-10-13T02:50:08+00:00",
        pages: 37,
        version: 4,
      },
      relationships: [
        {
          id: "396c08d3-ea0f-4c4f-9752-78a51ea5d080",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "7ef24527-5d1f-4d5e-b6f4-5d9107e83ac8",
          type: "user",
        },
      ],
    },
    {
      id: "66d6996f-d565-4b8f-b439-ef543db754aa",
      type: "chapter",
      attributes: {
        volume: "2",
        chapter: "11",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2023-02-15T11:35:57+00:00",
        readableAt: "2023-02-15T11:35:57+00:00",
        createdAt: "2023-02-15T11:35:57+00:00",
        updatedAt: "2023-02-15T11:37:40+00:00",
        pages: 36,
        version: 4,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "060831f3-a242-4a58-80b5-5fd3056c0368",
      type: "chapter",
      attributes: {
        volume: "2",
        chapter: "11",
        title: null,
        translatedLanguage: "pt-br",
        externalUrl: null,
        publishAt: "2022-09-17T00:07:25+00:00",
        readableAt: "2022-09-17T00:07:25+00:00",
        createdAt: "2022-09-17T00:07:25+00:00",
        updatedAt: "2022-09-17T00:07:41+00:00",
        pages: 36,
        version: 3,
      },
      relationships: [
        {
          id: "337fbc53-711c-4942-987e-6aa0f6989df3",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "f8141f68-0d8c-4a48-86f5-8161201d6abd",
          type: "user",
        },
      ],
    },
    {
      id: "ab044dc5-2621-4de2-858b-9e48ecfacdf7",
      type: "chapter",
      attributes: {
        volume: "2",
        chapter: "12",
        title: null,
        translatedLanguage: "id",
        externalUrl: null,
        publishAt: "2023-03-26T07:57:57+00:00",
        readableAt: "2023-03-26T07:57:57+00:00",
        createdAt: "2023-03-26T07:57:56+00:00",
        updatedAt: "2023-03-26T07:58:16+00:00",
        pages: 39,
        version: 3,
      },
      relationships: [
        {
          id: "396c08d3-ea0f-4c4f-9752-78a51ea5d080",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "7ef24527-5d1f-4d5e-b6f4-5d9107e83ac8",
          type: "user",
        },
      ],
    },
    {
      id: "820d6b32-0434-4fed-969e-4f57a3371753",
      type: "chapter",
      attributes: {
        volume: "2",
        chapter: "13",
        title: null,
        translatedLanguage: "id",
        externalUrl: null,
        publishAt: "2023-03-26T07:58:18+00:00",
        readableAt: "2023-03-26T07:58:18+00:00",
        createdAt: "2023-03-26T07:58:18+00:00",
        updatedAt: "2023-03-26T07:58:42+00:00",
        pages: 36,
        version: 3,
      },
      relationships: [
        {
          id: "396c08d3-ea0f-4c4f-9752-78a51ea5d080",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "7ef24527-5d1f-4d5e-b6f4-5d9107e83ac8",
          type: "user",
        },
      ],
    },
    {
      id: "68628218-8173-4273-8ab6-5d5c78c16b4e",
      type: "chapter",
      attributes: {
        volume: "3",
        chapter: "12",
        title: null,
        translatedLanguage: "pt-br",
        externalUrl: null,
        publishAt: "2023-01-03T14:10:24+00:00",
        readableAt: "2023-01-03T14:10:24+00:00",
        createdAt: "2023-01-03T14:10:23+00:00",
        updatedAt: "2023-02-21T15:55:17+00:00",
        pages: 35,
        version: 4,
      },
      relationships: [
        {
          id: "337fbc53-711c-4942-987e-6aa0f6989df3",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "1532c0a9-4620-45d3-8951-0a59802e8392",
          type: "user",
        },
      ],
    },
    {
      id: "1f7bb31a-78b6-4dfa-ae7d-9ba0a58071b3",
      type: "chapter",
      attributes: {
        volume: "3",
        chapter: "12.1",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2023-02-15T11:36:14+00:00",
        readableAt: "2023-02-15T11:36:14+00:00",
        createdAt: "2023-02-15T11:36:14+00:00",
        updatedAt: "2023-02-21T15:55:18+00:00",
        pages: 25,
        version: 5,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "7f2765fd-3623-4310-88b3-021b963ff7f8",
      type: "chapter",
      attributes: {
        volume: "3",
        chapter: "12.2",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2023-02-13T18:15:05+00:00",
        readableAt: "2023-02-13T18:15:05+00:00",
        createdAt: "2023-02-13T13:53:55+00:00",
        updatedAt: "2023-02-21T15:55:18+00:00",
        pages: 13,
        version: 4,
      },
      relationships: [
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "2f211aec-6a6c-4933-8830-872262f62d4d",
          type: "user",
        },
      ],
    },
    {
      id: "ee0be5d0-5f97-4dc1-b345-a322ecad137e",
      type: "chapter",
      attributes: {
        volume: "3",
        chapter: "12.2",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2023-03-08T21:28:48+00:00",
        readableAt: "2023-03-08T21:28:48+00:00",
        createdAt: "2023-03-08T21:28:48+00:00",
        updatedAt: "2023-03-08T21:34:21+00:00",
        pages: 13,
        version: 4,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "b2ea514a-daa4-48d4-936f-a25cd504f243",
      type: "chapter",
      attributes: {
        volume: "3",
        chapter: "13",
        title: null,
        translatedLanguage: "pt-br",
        externalUrl: null,
        publishAt: "2023-03-01T21:41:42+00:00",
        readableAt: "2023-03-01T21:41:42+00:00",
        createdAt: "2023-03-01T21:41:42+00:00",
        updatedAt: "2023-03-01T21:44:54+00:00",
        pages: 34,
        version: 4,
      },
      relationships: [
        {
          id: "337fbc53-711c-4942-987e-6aa0f6989df3",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "1532c0a9-4620-45d3-8951-0a59802e8392",
          type: "user",
        },
      ],
    },
    {
      id: "030bea13-9997-4124-86b1-91fbacd49949",
      type: "chapter",
      attributes: {
        volume: "3",
        chapter: "13.1",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2023-02-15T17:47:08+00:00",
        readableAt: "2023-02-15T17:47:08+00:00",
        createdAt: "2023-02-15T17:47:08+00:00",
        updatedAt: "2023-02-27T01:30:14+00:00",
        pages: 9,
        version: 7,
      },
      relationships: [
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "2f211aec-6a6c-4933-8830-872262f62d4d",
          type: "user",
        },
      ],
    },
    {
      id: "8a271d96-6624-4aaa-b370-3539e751f38e",
      type: "chapter",
      attributes: {
        volume: "3",
        chapter: "13.1",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2023-03-13T14:26:38+00:00",
        readableAt: "2023-03-13T14:26:38+00:00",
        createdAt: "2023-03-13T14:26:37+00:00",
        updatedAt: "2023-03-13T14:29:32+00:00",
        pages: 9,
        version: 4,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "5aee7785-a0d0-4afa-ae1d-060350854524",
      type: "chapter",
      attributes: {
        volume: "3",
        chapter: "13.2",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2023-03-01T16:03:49+00:00",
        readableAt: "2023-03-01T16:03:49+00:00",
        createdAt: "2023-03-01T16:03:49+00:00",
        updatedAt: "2023-03-01T16:13:55+00:00",
        pages: 27,
        version: 4,
      },
      relationships: [
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "2f211aec-6a6c-4933-8830-872262f62d4d",
          type: "user",
        },
      ],
    },
    {
      id: "4bf20a6f-688c-4322-8a9e-265087191399",
      type: "chapter",
      attributes: {
        volume: "3",
        chapter: "13.2",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2023-04-07T13:27:55+00:00",
        readableAt: "2023-04-07T13:27:55+00:00",
        createdAt: "2023-04-07T13:27:55+00:00",
        updatedAt: "2023-04-07T13:28:09+00:00",
        pages: 25,
        version: 3,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "4043d6f6-d563-4759-9fe5-bef016456b82",
      type: "chapter",
      attributes: {
        volume: "3",
        chapter: "14",
        title: null,
        translatedLanguage: "pt-br",
        externalUrl: null,
        publishAt: "2023-06-01T03:36:57+00:00",
        readableAt: "2023-06-01T03:36:57+00:00",
        createdAt: "2023-06-01T03:36:57+00:00",
        updatedAt: "2023-06-01T03:37:55+00:00",
        pages: 35,
        version: 3,
      },
      relationships: [
        {
          id: "337fbc53-711c-4942-987e-6aa0f6989df3",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "1532c0a9-4620-45d3-8951-0a59802e8392",
          type: "user",
        },
      ],
    },
    {
      id: "cb9ce55c-ba3e-4df4-993e-92339ecf2bd0",
      type: "chapter",
      attributes: {
        volume: "3",
        chapter: "14",
        title: null,
        translatedLanguage: "id",
        externalUrl: null,
        publishAt: "2022-09-30T05:56:20+00:00",
        readableAt: "2022-09-30T05:56:20+00:00",
        createdAt: "2022-09-30T05:56:20+00:00",
        updatedAt: "2023-02-21T15:55:17+00:00",
        pages: 35,
        version: 4,
      },
      relationships: [
        {
          id: "396c08d3-ea0f-4c4f-9752-78a51ea5d080",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "7ef24527-5d1f-4d5e-b6f4-5d9107e83ac8",
          type: "user",
        },
      ],
    },
    {
      id: "d8430699-311c-4ff0-9e10-a269cb5bebad",
      type: "chapter",
      attributes: {
        volume: "3",
        chapter: "14.1",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2023-06-11T18:16:40+00:00",
        readableAt: "2023-06-11T18:16:40+00:00",
        createdAt: "2023-06-11T18:16:40+00:00",
        updatedAt: "2023-06-11T20:55:47+00:00",
        pages: 18,
        version: 5,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "4ac27e2e-2614-44e8-99b1-0feda444a8a4",
      type: "chapter",
      attributes: {
        volume: "3",
        chapter: "14.1",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2023-03-14T01:44:56+00:00",
        readableAt: "2023-03-14T01:44:56+00:00",
        createdAt: "2023-03-14T01:44:55+00:00",
        updatedAt: "2023-03-14T01:45:56+00:00",
        pages: 17,
        version: 3,
      },
      relationships: [
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "2f211aec-6a6c-4933-8830-872262f62d4d",
          type: "user",
        },
      ],
    },
    {
      id: "4254283c-9799-4be0-a5fd-f596a8fcca09",
      type: "chapter",
      attributes: {
        volume: "3",
        chapter: "14.2",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2023-04-04T17:29:34+00:00",
        readableAt: "2023-04-04T17:29:34+00:00",
        createdAt: "2023-04-04T17:29:33+00:00",
        updatedAt: "2023-04-04T17:30:03+00:00",
        pages: 20,
        version: 3,
      },
      relationships: [
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "2f211aec-6a6c-4933-8830-872262f62d4d",
          type: "user",
        },
      ],
    },
    {
      id: "3db43fde-b4d4-47ed-b576-5a17c0bd6f03",
      type: "chapter",
      attributes: {
        volume: "3",
        chapter: "14.2",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2023-08-09T23:06:32+00:00",
        readableAt: "2023-08-09T23:06:32+00:00",
        createdAt: "2023-08-09T23:06:32+00:00",
        updatedAt: "2023-08-09T23:06:50+00:00",
        pages: 21,
        version: 3,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "b3391604-447d-47bc-9fa0-4ebef039f04e",
      type: "chapter",
      attributes: {
        volume: "3",
        chapter: "15",
        title: null,
        translatedLanguage: "pt-br",
        externalUrl: null,
        publishAt: "2023-12-01T17:45:11+00:00",
        readableAt: "2023-12-01T17:45:11+00:00",
        createdAt: "2023-12-01T17:45:11+00:00",
        updatedAt: "2023-12-01T17:53:24+00:00",
        pages: 40,
        version: 4,
      },
      relationships: [
        {
          id: "337fbc53-711c-4942-987e-6aa0f6989df3",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "1532c0a9-4620-45d3-8951-0a59802e8392",
          type: "user",
        },
      ],
    },
    {
      id: "f339ad31-ea0e-484f-9aaf-28f074900cdb",
      type: "chapter",
      attributes: {
        volume: "3",
        chapter: "15.1",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2023-08-09T23:05:42+00:00",
        readableAt: "2023-08-09T23:05:42+00:00",
        createdAt: "2023-08-09T23:05:41+00:00",
        updatedAt: "2023-08-09T23:06:48+00:00",
        pages: 15,
        version: 4,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "8cea0b6e-4ee7-495b-93eb-afa4191af2b0",
      type: "chapter",
      attributes: {
        volume: "3",
        chapter: "15.2",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2023-08-12T22:45:04+00:00",
        readableAt: "2023-08-12T22:45:04+00:00",
        createdAt: "2023-08-12T22:45:03+00:00",
        updatedAt: "2023-08-12T22:45:43+00:00",
        pages: 29,
        version: 3,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "0eb543b9-733a-4fd3-9d11-d2e1812c38ec",
      type: "chapter",
      attributes: {
        volume: "3",
        chapter: "15.2",
        title: null,
        translatedLanguage: "id",
        externalUrl: null,
        publishAt: "2023-09-14T08:42:53+00:00",
        readableAt: "2023-09-14T08:42:53+00:00",
        createdAt: "2023-09-14T08:42:53+00:00",
        updatedAt: "2023-09-14T08:43:29+00:00",
        pages: 26,
        version: 3,
      },
      relationships: [
        {
          id: "396c08d3-ea0f-4c4f-9752-78a51ea5d080",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "61baa102-956b-4439-b782-06114ce55d15",
          type: "user",
        },
      ],
    },
    {
      id: "6c195ff1-ad12-44c4-b8bd-f675556ab075",
      type: "chapter",
      attributes: {
        volume: "3",
        chapter: "16",
        title: null,
        translatedLanguage: "pt-br",
        externalUrl: null,
        publishAt: "2023-12-01T17:47:32+00:00",
        readableAt: "2023-12-01T17:47:32+00:00",
        createdAt: "2023-12-01T17:47:31+00:00",
        updatedAt: "2023-12-01T17:53:25+00:00",
        pages: 35,
        version: 4,
      },
      relationships: [
        {
          id: "337fbc53-711c-4942-987e-6aa0f6989df3",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "1532c0a9-4620-45d3-8951-0a59802e8392",
          type: "user",
        },
      ],
    },
    {
      id: "0e51f345-e018-44f1-aa0f-0f1b0569bd86",
      type: "chapter",
      attributes: {
        volume: "3",
        chapter: "16.1",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2023-08-14T13:38:31+00:00",
        readableAt: "2023-08-14T13:38:31+00:00",
        createdAt: "2023-08-14T13:38:31+00:00",
        updatedAt: "2023-08-14T13:38:52+00:00",
        pages: 12,
        version: 3,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "e5603de4-be40-4267-badf-3c9c9cf5c1c2",
      type: "chapter",
      attributes: {
        volume: "3",
        chapter: "16.2",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2024-05-05T15:09:48+00:00",
        readableAt: "2024-05-05T15:09:48+00:00",
        createdAt: "2024-05-05T15:09:48+00:00",
        updatedAt: "2024-05-05T15:10:40+00:00",
        pages: 28,
        version: 3,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "f033886d-ba5d-4a47-97a9-295f3581def2",
      type: "chapter",
      attributes: {
        volume: "3",
        chapter: "17",
        title: null,
        translatedLanguage: "pt-br",
        externalUrl: null,
        publishAt: "2023-12-01T17:51:15+00:00",
        readableAt: "2023-12-01T17:51:15+00:00",
        createdAt: "2023-12-01T17:51:15+00:00",
        updatedAt: "2023-12-01T17:53:27+00:00",
        pages: 39,
        version: 4,
      },
      relationships: [
        {
          id: "337fbc53-711c-4942-987e-6aa0f6989df3",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "1532c0a9-4620-45d3-8951-0a59802e8392",
          type: "user",
        },
      ],
    },
    {
      id: "c0e6fa69-d8f0-463a-941d-b75af821b35c",
      type: "chapter",
      attributes: {
        volume: "3",
        chapter: "17.1",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2024-05-05T15:11:18+00:00",
        readableAt: "2024-05-05T15:11:18+00:00",
        createdAt: "2024-05-05T15:11:17+00:00",
        updatedAt: "2024-05-05T15:11:45+00:00",
        pages: 18,
        version: 3,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "9613a8b5-417b-4a85-9a15-59ddab66060b",
      type: "chapter",
      attributes: {
        volume: "3",
        chapter: "17.2",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2024-05-05T15:11:38+00:00",
        readableAt: "2024-05-05T15:11:38+00:00",
        createdAt: "2024-05-05T15:11:37+00:00",
        updatedAt: "2024-05-05T15:12:07+00:00",
        pages: 26,
        version: 3,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "eb89fddb-e97c-476e-85e1-31a5bed725e3",
      type: "chapter",
      attributes: {
        volume: "4",
        chapter: "18",
        title: null,
        translatedLanguage: "pt-br",
        externalUrl: null,
        publishAt: "2024-06-24T17:01:32+00:00",
        readableAt: "2024-06-24T17:01:32+00:00",
        createdAt: "2024-06-24T17:01:30+00:00",
        updatedAt: "2024-06-24T17:03:25+00:00",
        pages: 33,
        version: 4,
      },
      relationships: [
        {
          id: "337fbc53-711c-4942-987e-6aa0f6989df3",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "1532c0a9-4620-45d3-8951-0a59802e8392",
          type: "user",
        },
      ],
    },
    {
      id: "0a1cd450-59db-41c4-8acb-23094378d514",
      type: "chapter",
      attributes: {
        volume: "4",
        chapter: "18",
        title: null,
        translatedLanguage: "vi",
        externalUrl: null,
        publishAt: "2024-10-06T09:22:14+00:00",
        readableAt: "2024-10-06T09:22:14+00:00",
        createdAt: "2024-10-06T09:22:13+00:00",
        updatedAt: "2024-10-06T20:48:01+00:00",
        pages: 30,
        version: 5,
      },
      relationships: [
        {
          id: "d72094ab-d2ea-4175-ba82-227f4fe05356",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "c2966c8c-8415-417f-8180-00d13f8b5069",
          type: "user",
        },
      ],
    },
    {
      id: "3bd07ba1-a3b0-4fb9-9c56-15b04d850d1e",
      type: "chapter",
      attributes: {
        volume: "4",
        chapter: "18.1",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2024-05-05T15:11:54+00:00",
        readableAt: "2024-05-05T15:11:54+00:00",
        createdAt: "2024-05-05T15:11:53+00:00",
        updatedAt: "2024-05-05T15:12:11+00:00",
        pages: 15,
        version: 3,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "c78d82a2-0dda-4a49-87fa-852fd95cc182",
      type: "chapter",
      attributes: {
        volume: "4",
        chapter: "18.2",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2024-05-05T15:12:13+00:00",
        readableAt: "2024-05-05T15:12:13+00:00",
        createdAt: "2024-05-05T15:12:13+00:00",
        updatedAt: "2024-05-05T15:12:35+00:00",
        pages: 21,
        version: 3,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "aa572b5d-e935-4fc4-b726-594553d0975a",
      type: "chapter",
      attributes: {
        volume: "4",
        chapter: "19",
        title: null,
        translatedLanguage: "pt-br",
        externalUrl: null,
        publishAt: "2024-06-26T12:15:27+00:00",
        readableAt: "2024-06-26T12:15:27+00:00",
        createdAt: "2024-06-26T12:15:26+00:00",
        updatedAt: "2024-06-26T12:22:12+00:00",
        pages: 33,
        version: 4,
      },
      relationships: [
        {
          id: "337fbc53-711c-4942-987e-6aa0f6989df3",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "1532c0a9-4620-45d3-8951-0a59802e8392",
          type: "user",
        },
      ],
    },
    {
      id: "5eed4b22-7a33-482c-a131-344fa36ffc49",
      type: "chapter",
      attributes: {
        volume: "4",
        chapter: "19",
        title: null,
        translatedLanguage: "vi",
        externalUrl: null,
        publishAt: "2024-10-06T09:22:51+00:00",
        readableAt: "2024-10-06T09:22:51+00:00",
        createdAt: "2024-10-06T09:22:50+00:00",
        updatedAt: "2024-10-06T20:46:17+00:00",
        pages: 37,
        version: 4,
      },
      relationships: [
        {
          id: "d72094ab-d2ea-4175-ba82-227f4fe05356",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "c2966c8c-8415-417f-8180-00d13f8b5069",
          type: "user",
        },
      ],
    },
    {
      id: "6770f7f5-d897-4021-a843-7e46613c31b3",
      type: "chapter",
      attributes: {
        volume: "4",
        chapter: "19.1",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2024-05-05T15:12:30+00:00",
        readableAt: "2024-05-05T15:12:30+00:00",
        createdAt: "2024-05-05T15:12:29+00:00",
        updatedAt: "2024-05-05T17:10:11+00:00",
        pages: 15,
        version: 4,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "47bda75d-3ae4-4be7-8ad0-6d8c2c3dc0be",
      type: "chapter",
      attributes: {
        volume: "4",
        chapter: "19.2",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2024-05-05T15:13:01+00:00",
        readableAt: "2024-05-05T15:13:01+00:00",
        createdAt: "2024-05-05T15:13:00+00:00",
        updatedAt: "2024-05-05T15:13:23+00:00",
        pages: 22,
        version: 3,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "751c7dad-c016-4361-82b7-1f29bae2cc5a",
      type: "chapter",
      attributes: {
        volume: "4",
        chapter: "20",
        title: null,
        translatedLanguage: "pt-br",
        externalUrl: null,
        publishAt: "2024-08-04T23:47:34+00:00",
        readableAt: "2024-08-04T23:47:34+00:00",
        createdAt: "2024-08-04T23:47:33+00:00",
        updatedAt: "2024-08-04T23:47:56+00:00",
        pages: 31,
        version: 3,
      },
      relationships: [
        {
          id: "337fbc53-711c-4942-987e-6aa0f6989df3",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "1532c0a9-4620-45d3-8951-0a59802e8392",
          type: "user",
        },
      ],
    },
    {
      id: "f0cf90e3-10d6-4d96-9d70-eaa1d30da3aa",
      type: "chapter",
      attributes: {
        volume: "4",
        chapter: "20",
        title: null,
        translatedLanguage: "vi",
        externalUrl: null,
        publishAt: "2024-10-06T09:23:11+00:00",
        readableAt: "2024-10-06T09:23:11+00:00",
        createdAt: "2024-10-06T09:23:10+00:00",
        updatedAt: "2024-10-06T20:48:02+00:00",
        pages: 30,
        version: 4,
      },
      relationships: [
        {
          id: "d72094ab-d2ea-4175-ba82-227f4fe05356",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "c2966c8c-8415-417f-8180-00d13f8b5069",
          type: "user",
        },
      ],
    },
    {
      id: "30046566-6148-4554-be1c-f9766cdf3e22",
      type: "chapter",
      attributes: {
        volume: "4",
        chapter: "20.1",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2024-05-05T15:13:15+00:00",
        readableAt: "2024-05-05T15:13:15+00:00",
        createdAt: "2024-05-05T15:13:14+00:00",
        updatedAt: "2024-05-05T15:13:37+00:00",
        pages: 16,
        version: 3,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "7b8b4597-8d23-445c-be1c-2e0bcb21e816",
      type: "chapter",
      attributes: {
        volume: "4",
        chapter: "20.2",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2024-05-05T15:14:35+00:00",
        readableAt: "2024-05-05T15:14:35+00:00",
        createdAt: "2024-05-05T15:14:34+00:00",
        updatedAt: "2024-05-05T15:14:47+00:00",
        pages: 19,
        version: 3,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "fd1da2c0-e567-425e-a9f7-70123f9a0e34",
      type: "chapter",
      attributes: {
        volume: "4",
        chapter: "21",
        title: null,
        translatedLanguage: "vi",
        externalUrl: null,
        publishAt: "2024-10-06T09:25:50+00:00",
        readableAt: "2024-10-06T09:25:50+00:00",
        createdAt: "2024-10-06T09:25:49+00:00",
        updatedAt: "2024-10-06T20:48:02+00:00",
        pages: 26,
        version: 4,
      },
      relationships: [
        {
          id: "d72094ab-d2ea-4175-ba82-227f4fe05356",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "c2966c8c-8415-417f-8180-00d13f8b5069",
          type: "user",
        },
      ],
    },
    {
      id: "92829ac0-5dbf-4fd2-a8a6-e42e8df43acb",
      type: "chapter",
      attributes: {
        volume: "4",
        chapter: "21",
        title: null,
        translatedLanguage: "pt-br",
        externalUrl: null,
        publishAt: "2024-12-23T15:37:14+00:00",
        readableAt: "2024-12-23T15:37:14+00:00",
        createdAt: "2024-12-23T15:37:13+00:00",
        updatedAt: "2024-12-23T15:37:55+00:00",
        pages: 27,
        version: 3,
      },
      relationships: [
        {
          id: "337fbc53-711c-4942-987e-6aa0f6989df3",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "1532c0a9-4620-45d3-8951-0a59802e8392",
          type: "user",
        },
      ],
    },
    {
      id: "f893200f-902b-43f4-8931-946fd75b410f",
      type: "chapter",
      attributes: {
        volume: "4",
        chapter: "21.1",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2024-05-05T15:17:38+00:00",
        readableAt: "2024-05-05T15:17:38+00:00",
        createdAt: "2024-05-05T15:17:37+00:00",
        updatedAt: "2024-05-05T15:18:06+00:00",
        pages: 16,
        version: 3,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "20baa02e-c053-404f-93e8-32216943d0cf",
      type: "chapter",
      attributes: {
        volume: "4",
        chapter: "21.2",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2024-05-05T15:18:30+00:00",
        readableAt: "2024-05-05T15:18:30+00:00",
        createdAt: "2024-05-05T15:18:29+00:00",
        updatedAt: "2024-05-05T15:18:45+00:00",
        pages: 15,
        version: 3,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "d712ff7d-727d-497b-8a13-d290a2cdf122",
      type: "chapter",
      attributes: {
        volume: "4",
        chapter: "22",
        title: null,
        translatedLanguage: "pt-br",
        externalUrl: null,
        publishAt: "2025-01-03T15:46:47+00:00",
        readableAt: "2025-01-03T15:46:47+00:00",
        createdAt: "2025-01-03T15:46:46+00:00",
        updatedAt: "2025-01-03T15:47:39+00:00",
        pages: 39,
        version: 3,
      },
      relationships: [
        {
          id: "337fbc53-711c-4942-987e-6aa0f6989df3",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "1532c0a9-4620-45d3-8951-0a59802e8392",
          type: "user",
        },
      ],
    },
    {
      id: "53a08db3-15da-4884-b9d4-ac5b1ebba0cf",
      type: "chapter",
      attributes: {
        volume: "4",
        chapter: "22",
        title: "J'ai Offert Un Cadeau À La Fille Que Je Déteste Le Plus.",
        translatedLanguage: "fr",
        externalUrl: null,
        publishAt: "2024-05-05T21:57:54+00:00",
        readableAt: "2024-05-05T21:57:54+00:00",
        createdAt: "2024-05-05T21:57:53+00:00",
        updatedAt: "2024-05-05T21:58:37+00:00",
        pages: 42,
        version: 3,
      },
      relationships: [
        {
          id: "bf30f2b8-fb1c-4859-940f-c678cff30660",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "42efcf9d-535b-4ebc-bd0c-14b8ec705b84",
          type: "user",
        },
      ],
    },
    {
      id: "f98a6e24-c71b-4286-bedb-93640590c584",
      type: "chapter",
      attributes: {
        volume: "4",
        chapter: "22",
        title: null,
        translatedLanguage: "vi",
        externalUrl: null,
        publishAt: "2024-10-06T09:26:11+00:00",
        readableAt: "2024-10-06T09:26:11+00:00",
        createdAt: "2024-10-06T09:26:11+00:00",
        updatedAt: "2024-10-06T20:48:03+00:00",
        pages: 38,
        version: 4,
      },
      relationships: [
        {
          id: "d72094ab-d2ea-4175-ba82-227f4fe05356",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "c2966c8c-8415-417f-8180-00d13f8b5069",
          type: "user",
        },
      ],
    },
    {
      id: "e1e68d8d-4bd0-4da5-a580-c34f64187a29",
      type: "chapter",
      attributes: {
        volume: "4",
        chapter: "22.1",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2024-05-05T15:18:46+00:00",
        readableAt: "2024-05-05T15:18:46+00:00",
        createdAt: "2024-05-05T15:18:45+00:00",
        updatedAt: "2024-05-05T15:18:58+00:00",
        pages: 16,
        version: 3,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "9218c1c3-00b1-4dae-89e7-70fafe1ceb67",
      type: "chapter",
      attributes: {
        volume: "4",
        chapter: "22.2",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2024-05-05T15:19:04+00:00",
        readableAt: "2024-05-05T15:19:04+00:00",
        createdAt: "2024-05-05T15:19:03+00:00",
        updatedAt: "2025-01-08T13:32:58+00:00",
        pages: 27,
        version: 4,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "ebb575f5-909f-44f1-9465-9de6bbd035b4",
      type: "chapter",
      attributes: {
        volume: "4",
        chapter: "23",
        title:
          "J'ai Cherché Quelque Chose Avec La Fille Que Je Déteste Le Plus.",
        translatedLanguage: "fr",
        externalUrl: null,
        publishAt: "2024-05-05T22:00:16+00:00",
        readableAt: "2024-05-05T22:00:16+00:00",
        createdAt: "2024-05-05T22:00:15+00:00",
        updatedAt: "2024-05-05T22:01:27+00:00",
        pages: 41,
        version: 3,
      },
      relationships: [
        {
          id: "bf30f2b8-fb1c-4859-940f-c678cff30660",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "42efcf9d-535b-4ebc-bd0c-14b8ec705b84",
          type: "user",
        },
      ],
    },
    {
      id: "7855897a-568e-4837-af94-71e3eb3ba8f6",
      type: "chapter",
      attributes: {
        volume: "4",
        chapter: "23",
        title: null,
        translatedLanguage: "pt-br",
        externalUrl: null,
        publishAt: "2025-01-03T15:48:57+00:00",
        readableAt: "2025-01-03T15:48:57+00:00",
        createdAt: "2025-01-03T15:48:56+00:00",
        updatedAt: "2025-01-03T15:49:37+00:00",
        pages: 38,
        version: 3,
      },
      relationships: [
        {
          id: "337fbc53-711c-4942-987e-6aa0f6989df3",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "1532c0a9-4620-45d3-8951-0a59802e8392",
          type: "user",
        },
      ],
    },
    {
      id: "84dc2fea-1c08-4164-840c-4a6db95c6cbf",
      type: "chapter",
      attributes: {
        volume: "4",
        chapter: "23",
        title: null,
        translatedLanguage: "vi",
        externalUrl: null,
        publishAt: "2024-10-06T09:26:37+00:00",
        readableAt: "2024-10-06T09:26:37+00:00",
        createdAt: "2024-10-06T09:26:36+00:00",
        updatedAt: "2024-10-06T20:48:03+00:00",
        pages: 38,
        version: 4,
      },
      relationships: [
        {
          id: "d72094ab-d2ea-4175-ba82-227f4fe05356",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "c2966c8c-8415-417f-8180-00d13f8b5069",
          type: "user",
        },
      ],
    },
    {
      id: "6584b171-34a4-4e3e-b2ae-fe53f3b8a020",
      type: "chapter",
      attributes: {
        volume: "4",
        chapter: "23.1",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2024-05-05T15:19:20+00:00",
        readableAt: "2024-05-05T15:19:20+00:00",
        createdAt: "2024-05-05T15:19:19+00:00",
        updatedAt: "2024-05-05T15:19:43+00:00",
        pages: 21,
        version: 3,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "e5ff37d5-0d49-4309-a12a-dba13d644c47",
      type: "chapter",
      attributes: {
        volume: "4",
        chapter: "23.2",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2024-05-05T15:19:40+00:00",
        readableAt: "2024-05-05T15:19:40+00:00",
        createdAt: "2024-05-05T15:19:40+00:00",
        updatedAt: "2024-05-05T15:20:05+00:00",
        pages: 22,
        version: 3,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "48fa98fc-d313-4f22-8d6c-a6d13470cdbc",
      type: "chapter",
      attributes: {
        volume: "5",
        chapter: "24",
        title:
          "J'ai Rencontré La Petite OO De La Fille Que Je Déteste Le Plus.",
        translatedLanguage: "fr",
        externalUrl: null,
        publishAt: "2024-05-21T19:50:32+00:00",
        readableAt: "2024-05-21T19:50:32+00:00",
        createdAt: "2024-05-21T19:50:31+00:00",
        updatedAt: "2024-05-21T19:51:10+00:00",
        pages: 37,
        version: 3,
      },
      relationships: [
        {
          id: "bf30f2b8-fb1c-4859-940f-c678cff30660",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "42efcf9d-535b-4ebc-bd0c-14b8ec705b84",
          type: "user",
        },
      ],
    },
    {
      id: "de3c97be-0de8-4302-9357-26d594908884",
      type: "chapter",
      attributes: {
        volume: "5",
        chapter: "24",
        title: null,
        translatedLanguage: "vi",
        externalUrl: null,
        publishAt: "2024-10-06T09:27:13+00:00",
        readableAt: "2024-10-06T09:27:13+00:00",
        createdAt: "2024-10-06T09:27:12+00:00",
        updatedAt: "2024-10-06T20:48:04+00:00",
        pages: 34,
        version: 4,
      },
      relationships: [
        {
          id: "d72094ab-d2ea-4175-ba82-227f4fe05356",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "c2966c8c-8415-417f-8180-00d13f8b5069",
          type: "user",
        },
      ],
    },
    {
      id: "7d31f9df-f0a6-469a-8900-f7a82ae7442d",
      type: "chapter",
      attributes: {
        volume: "5",
        chapter: "24.1",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2024-05-05T15:20:00+00:00",
        readableAt: "2024-05-05T15:20:00+00:00",
        createdAt: "2024-05-05T15:19:59+00:00",
        updatedAt: "2024-05-05T15:20:19+00:00",
        pages: 19,
        version: 3,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "60c9da16-db71-491d-a53d-e3af039b86f3",
      type: "chapter",
      attributes: {
        volume: "5",
        chapter: "24.2",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2024-10-14T18:07:10+00:00",
        readableAt: "2024-10-14T18:07:10+00:00",
        createdAt: "2024-10-14T18:07:10+00:00",
        updatedAt: "2024-10-14T18:07:26+00:00",
        pages: 20,
        version: 3,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "89b84fca-f429-4325-bc0d-2477864256e6",
      type: "chapter",
      attributes: {
        volume: "5",
        chapter: "25",
        title:
          "La Petite Sœur De La Fille Que Je Déteste Le Plus Est Venue Chez Moi. ",
        translatedLanguage: "fr",
        externalUrl: null,
        publishAt: "2024-06-02T20:21:41+00:00",
        readableAt: "2024-06-02T20:21:41+00:00",
        createdAt: "2024-06-02T20:21:40+00:00",
        updatedAt: "2024-06-02T20:22:24+00:00",
        pages: 34,
        version: 3,
      },
      relationships: [
        {
          id: "bf30f2b8-fb1c-4859-940f-c678cff30660",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "42efcf9d-535b-4ebc-bd0c-14b8ec705b84",
          type: "user",
        },
      ],
    },
    {
      id: "0d487ea6-7eab-4e82-af22-33a362b852ab",
      type: "chapter",
      attributes: {
        volume: "5",
        chapter: "25",
        title: null,
        translatedLanguage: "vi",
        externalUrl: null,
        publishAt: "2024-10-06T09:27:37+00:00",
        readableAt: "2024-10-06T09:27:37+00:00",
        createdAt: "2024-10-06T09:27:36+00:00",
        updatedAt: "2024-10-06T20:48:04+00:00",
        pages: 31,
        version: 4,
      },
      relationships: [
        {
          id: "d72094ab-d2ea-4175-ba82-227f4fe05356",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "c2966c8c-8415-417f-8180-00d13f8b5069",
          type: "user",
        },
      ],
    },
    {
      id: "c40989d5-f382-439f-b1e7-6286f548b393",
      type: "chapter",
      attributes: {
        volume: "5",
        chapter: "25.1",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2024-10-14T18:07:25+00:00",
        readableAt: "2024-10-14T18:07:25+00:00",
        createdAt: "2024-10-14T18:07:25+00:00",
        updatedAt: "2024-10-14T18:07:36+00:00",
        pages: 11,
        version: 3,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "aade06d0-c7fa-4443-b2cc-c54220dc3c78",
      type: "chapter",
      attributes: {
        volume: "5",
        chapter: "25.2",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2024-10-14T18:07:41+00:00",
        readableAt: "2024-10-14T18:07:41+00:00",
        createdAt: "2024-10-14T18:07:41+00:00",
        updatedAt: "2024-10-14T18:08:00+00:00",
        pages: 25,
        version: 3,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "0dae9a89-c85d-4308-810a-08fe3e1bbf88",
      type: "chapter",
      attributes: {
        volume: "5",
        chapter: "26",
        title:
          "Je Me Suis Retrouvé À Passer Du Temps Avec La Fille Que Je Déteste Le Plus.",
        translatedLanguage: "fr",
        externalUrl: null,
        publishAt: "2024-07-30T19:25:49+00:00",
        readableAt: "2024-07-30T19:25:49+00:00",
        createdAt: "2024-07-30T19:25:48+00:00",
        updatedAt: "2024-07-30T19:26:23+00:00",
        pages: 37,
        version: 3,
      },
      relationships: [
        {
          id: "bf30f2b8-fb1c-4859-940f-c678cff30660",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "42efcf9d-535b-4ebc-bd0c-14b8ec705b84",
          type: "user",
        },
      ],
    },
    {
      id: "c13a00d3-c45a-4103-8481-ead6a61af125",
      type: "chapter",
      attributes: {
        volume: "5",
        chapter: "26",
        title: null,
        translatedLanguage: "vi",
        externalUrl: null,
        publishAt: "2024-10-06T09:27:56+00:00",
        readableAt: "2024-10-06T09:27:56+00:00",
        createdAt: "2024-10-06T09:27:56+00:00",
        updatedAt: "2024-10-06T20:48:04+00:00",
        pages: 31,
        version: 4,
      },
      relationships: [
        {
          id: "d72094ab-d2ea-4175-ba82-227f4fe05356",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "c2966c8c-8415-417f-8180-00d13f8b5069",
          type: "user",
        },
      ],
    },
    {
      id: "4d007642-1b31-43f3-aa7a-f47005eec49d",
      type: "chapter",
      attributes: {
        volume: "5",
        chapter: "26.1",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2024-10-14T18:08:11+00:00",
        readableAt: "2024-10-14T18:08:11+00:00",
        createdAt: "2024-10-14T18:08:10+00:00",
        updatedAt: "2024-10-14T18:08:28+00:00",
        pages: 25,
        version: 3,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "840ff44f-5460-4081-99b0-eb53d0fef956",
      type: "chapter",
      attributes: {
        volume: "5",
        chapter: "26.2",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2024-10-14T18:08:25+00:00",
        readableAt: "2024-10-14T18:08:25+00:00",
        createdAt: "2024-10-14T18:08:24+00:00",
        updatedAt: "2024-10-14T18:08:38+00:00",
        pages: 14,
        version: 3,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "0dac6fb1-841d-4b03-8c8d-2ff4720f0986",
      type: "chapter",
      attributes: {
        volume: "5",
        chapter: "27",
        title:
          "Je Suis Allé Dans Un Parc D'attractions Avec La Fille Que Je Déteste Le Plus.",
        translatedLanguage: "fr",
        externalUrl: null,
        publishAt: "2024-07-30T19:31:21+00:00",
        readableAt: "2024-07-30T19:31:21+00:00",
        createdAt: "2024-07-30T19:31:20+00:00",
        updatedAt: "2024-07-30T19:31:47+00:00",
        pages: 32,
        version: 3,
      },
      relationships: [
        {
          id: "bf30f2b8-fb1c-4859-940f-c678cff30660",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "42efcf9d-535b-4ebc-bd0c-14b8ec705b84",
          type: "user",
        },
      ],
    },
    {
      id: "48d292da-89f9-4284-a835-3c5ce3da52b9",
      type: "chapter",
      attributes: {
        volume: "5",
        chapter: "27",
        title: null,
        translatedLanguage: "vi",
        externalUrl: null,
        publishAt: "2024-10-06T09:28:15+00:00",
        readableAt: "2024-10-06T09:28:15+00:00",
        createdAt: "2024-10-06T09:28:14+00:00",
        updatedAt: "2024-10-06T20:48:05+00:00",
        pages: 30,
        version: 5,
      },
      relationships: [
        {
          id: "d72094ab-d2ea-4175-ba82-227f4fe05356",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "c2966c8c-8415-417f-8180-00d13f8b5069",
          type: "user",
        },
      ],
    },
    {
      id: "162cc097-6d44-41b4-9358-105abf2357d3",
      type: "chapter",
      attributes: {
        volume: "5",
        chapter: "27.1",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2024-10-14T18:09:10+00:00",
        readableAt: "2024-10-14T18:09:10+00:00",
        createdAt: "2024-10-14T18:09:10+00:00",
        updatedAt: "2024-10-14T18:09:20+00:00",
        pages: 14,
        version: 3,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "35dfad55-43f2-46ef-b384-c8f3ba0f816c",
      type: "chapter",
      attributes: {
        volume: "5",
        chapter: "27.2",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2024-10-14T18:09:25+00:00",
        readableAt: "2024-10-14T18:09:25+00:00",
        createdAt: "2024-10-14T18:09:24+00:00",
        updatedAt: "2024-10-14T18:09:43+00:00",
        pages: 19,
        version: 3,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "7acb8184-00b9-4e2b-9a16-4a1b3a42506d",
      type: "chapter",
      attributes: {
        volume: "5",
        chapter: "27.3",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2024-10-14T18:09:37+00:00",
        readableAt: "2024-10-14T18:09:37+00:00",
        createdAt: "2024-10-14T18:09:36+00:00",
        updatedAt: "2024-10-14T18:09:44+00:00",
        pages: 1,
        version: 3,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "1e72903e-6cb5-4f1c-a9a1-0522b15692f1",
      type: "chapter",
      attributes: {
        volume: "5",
        chapter: "28",
        title: "J'ai Été Mis À La Porte Par La Fille Que Je Déteste Le Plus.",
        translatedLanguage: "fr",
        externalUrl: null,
        publishAt: "2024-09-04T13:20:18+00:00",
        readableAt: "2024-09-04T13:20:18+00:00",
        createdAt: "2024-09-04T13:20:10+00:00",
        updatedAt: "2024-09-04T13:20:41+00:00",
        pages: 39,
        version: 3,
      },
      relationships: [
        {
          id: "bf30f2b8-fb1c-4859-940f-c678cff30660",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "42efcf9d-535b-4ebc-bd0c-14b8ec705b84",
          type: "user",
        },
      ],
    },
    {
      id: "db9410be-c10a-41fe-be49-a1e32c6f791a",
      type: "chapter",
      attributes: {
        volume: "5",
        chapter: "28",
        title: null,
        translatedLanguage: "vi",
        externalUrl: null,
        publishAt: "2024-10-06T09:28:42+00:00",
        readableAt: "2024-10-06T09:28:42+00:00",
        createdAt: "2024-10-06T09:28:41+00:00",
        updatedAt: "2024-10-06T20:48:05+00:00",
        pages: 36,
        version: 4,
      },
      relationships: [
        {
          id: "d72094ab-d2ea-4175-ba82-227f4fe05356",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "c2966c8c-8415-417f-8180-00d13f8b5069",
          type: "user",
        },
      ],
    },
    {
      id: "50a2f409-b3aa-45ba-991e-2c12b7aa9fdf",
      type: "chapter",
      attributes: {
        volume: "5",
        chapter: "28.1",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2024-10-14T18:09:51+00:00",
        readableAt: "2024-10-14T18:09:51+00:00",
        createdAt: "2024-10-14T18:09:50+00:00",
        updatedAt: "2024-10-14T18:10:12+00:00",
        pages: 13,
        version: 3,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "9b3199bb-a60d-4c5b-b549-31448bf4fe73",
      type: "chapter",
      attributes: {
        volume: "5",
        chapter: "28.2",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2024-10-14T18:10:09+00:00",
        readableAt: "2024-10-14T18:10:09+00:00",
        createdAt: "2024-10-14T18:10:09+00:00",
        updatedAt: "2024-10-14T18:10:34+00:00",
        pages: 28,
        version: 3,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "06da9add-82ca-4c99-8b08-a845e7c330e3",
      type: "chapter",
      attributes: {
        volume: "5",
        chapter: "29",
        title: null,
        translatedLanguage: "vi",
        externalUrl: null,
        publishAt: "2024-10-06T09:29:12+00:00",
        readableAt: "2024-10-06T09:29:12+00:00",
        createdAt: "2024-10-06T09:29:12+00:00",
        updatedAt: "2024-10-06T20:48:06+00:00",
        pages: 30,
        version: 4,
      },
      relationships: [
        {
          id: "d72094ab-d2ea-4175-ba82-227f4fe05356",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "c2966c8c-8415-417f-8180-00d13f8b5069",
          type: "user",
        },
      ],
    },
    {
      id: "2396e609-1607-4677-b991-0063e06560f3",
      type: "chapter",
      attributes: {
        volume: "5",
        chapter: "29",
        title:
          "La Fille Que Je Déteste Le Plus M'a Demandé Ce Que Je Ressens Vraiment.",
        translatedLanguage: "fr",
        externalUrl: null,
        publishAt: "2024-11-03T21:07:08+00:00",
        readableAt: "2024-11-03T21:07:08+00:00",
        createdAt: "2024-11-03T21:07:07+00:00",
        updatedAt: "2024-11-03T21:07:24+00:00",
        pages: 31,
        version: 3,
      },
      relationships: [
        {
          id: "bf30f2b8-fb1c-4859-940f-c678cff30660",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "42efcf9d-535b-4ebc-bd0c-14b8ec705b84",
          type: "user",
        },
      ],
    },
    {
      id: "53cef526-a1ba-49ec-8fa1-fc36a614f91b",
      type: "chapter",
      attributes: {
        volume: "5",
        chapter: "29.1",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2024-10-14T18:10:24+00:00",
        readableAt: "2024-10-14T18:10:24+00:00",
        createdAt: "2024-10-14T18:10:23+00:00",
        updatedAt: "2024-10-14T18:10:47+00:00",
        pages: 20,
        version: 3,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "c6013e3e-04e2-433c-beee-616a0f1706d7",
      type: "chapter",
      attributes: {
        volume: "5",
        chapter: "29.2",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2024-10-14T18:10:39+00:00",
        readableAt: "2024-10-14T18:10:39+00:00",
        createdAt: "2024-10-14T18:10:39+00:00",
        updatedAt: "2024-10-14T18:10:56+00:00",
        pages: 14,
        version: 3,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "47f91908-c256-4807-a515-574a5c4f790e",
      type: "chapter",
      attributes: {
        volume: "5",
        chapter: "29.5",
        title: "Chapitre Bonus Tome 5",
        translatedLanguage: "fr",
        externalUrl: null,
        publishAt: "2024-11-03T21:18:58+00:00",
        readableAt: "2024-11-03T21:18:58+00:00",
        createdAt: "2024-11-03T21:18:57+00:00",
        updatedAt: "2024-11-03T21:19:08+00:00",
        pages: 6,
        version: 3,
      },
      relationships: [
        {
          id: "bf30f2b8-fb1c-4859-940f-c678cff30660",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "42efcf9d-535b-4ebc-bd0c-14b8ec705b84",
          type: "user",
        },
      ],
    },
    {
      id: "ce6b28ee-4d8c-4e69-b9fe-6c7657cda38d",
      type: "chapter",
      attributes: {
        volume: "6",
        chapter: "30",
        title:
          "Ma Relation Avec La Fille Que Je Déteste Le Plus a Été Révélée Au Grand Jour.",
        translatedLanguage: "fr",
        externalUrl: null,
        publishAt: "2024-11-04T14:30:47+00:00",
        readableAt: "2024-11-04T14:30:47+00:00",
        createdAt: "2024-11-04T14:30:45+00:00",
        updatedAt: "2024-11-04T14:31:11+00:00",
        pages: 36,
        version: 3,
      },
      relationships: [
        {
          id: "bf30f2b8-fb1c-4859-940f-c678cff30660",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "42efcf9d-535b-4ebc-bd0c-14b8ec705b84",
          type: "user",
        },
      ],
    },
    {
      id: "a2af9fcf-443f-4a91-a7c7-c95b2ad2f913",
      type: "chapter",
      attributes: {
        volume: "6",
        chapter: "30",
        title: null,
        translatedLanguage: "vi",
        externalUrl: null,
        publishAt: "2024-10-06T09:29:51+00:00",
        readableAt: "2024-10-06T09:29:51+00:00",
        createdAt: "2024-10-06T09:29:50+00:00",
        updatedAt: "2024-10-06T20:48:06+00:00",
        pages: 33,
        version: 4,
      },
      relationships: [
        {
          id: "d72094ab-d2ea-4175-ba82-227f4fe05356",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "c2966c8c-8415-417f-8180-00d13f8b5069",
          type: "user",
        },
      ],
    },
    {
      id: "55a457a6-1400-4698-8673-dbefcac758e3",
      type: "chapter",
      attributes: {
        volume: "6",
        chapter: "30.1",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2024-12-21T13:01:53+00:00",
        readableAt: "2024-12-21T13:01:53+00:00",
        createdAt: "2024-12-21T13:01:52+00:00",
        updatedAt: "2024-12-21T14:00:38+00:00",
        pages: 15,
        version: 4,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "5b01060f-dc02-445c-a431-4cd42fcb902d",
      type: "chapter",
      attributes: {
        volume: "6",
        chapter: "30.2",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2024-12-21T13:02:15+00:00",
        readableAt: "2024-12-21T13:02:15+00:00",
        createdAt: "2024-12-21T13:02:15+00:00",
        updatedAt: "2024-12-21T14:00:38+00:00",
        pages: 22,
        version: 4,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "a8c39999-6c38-4846-bf5c-69d69bde69ec",
      type: "chapter",
      attributes: {
        volume: "6",
        chapter: "31",
        title: null,
        translatedLanguage: "vi",
        externalUrl: null,
        publishAt: "2024-10-06T09:30:30+00:00",
        readableAt: "2024-10-06T09:30:30+00:00",
        createdAt: "2024-10-06T09:30:30+00:00",
        updatedAt: "2024-10-06T20:48:06+00:00",
        pages: 32,
        version: 4,
      },
      relationships: [
        {
          id: "d72094ab-d2ea-4175-ba82-227f4fe05356",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "c2966c8c-8415-417f-8180-00d13f8b5069",
          type: "user",
        },
      ],
    },
    {
      id: "5b94fb86-afd3-4835-b9bc-f845b5158a05",
      type: "chapter",
      attributes: {
        volume: "6",
        chapter: "31",
        title:
          "Je Fais Semblant D'être En Couple Avec La Meilleure Amie De La Fille Que Je Déteste Le Plus. (Partie 1)",
        translatedLanguage: "fr",
        externalUrl: null,
        publishAt: "2024-12-02T15:19:01+00:00",
        readableAt: "2024-12-02T15:19:01+00:00",
        createdAt: "2024-12-02T15:19:00+00:00",
        updatedAt: "2024-12-02T22:06:51+00:00",
        pages: 34,
        version: 5,
      },
      relationships: [
        {
          id: "bf30f2b8-fb1c-4859-940f-c678cff30660",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "42efcf9d-535b-4ebc-bd0c-14b8ec705b84",
          type: "user",
        },
      ],
    },
    {
      id: "7b577b79-2ef1-4d5e-a7a2-d3bfcf8e0143",
      type: "chapter",
      attributes: {
        volume: "6",
        chapter: "31.1",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2024-12-21T13:02:43+00:00",
        readableAt: "2024-12-21T13:02:43+00:00",
        createdAt: "2024-12-21T13:02:42+00:00",
        updatedAt: "2024-12-21T14:00:39+00:00",
        pages: 20,
        version: 4,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "1d000c29-560d-4957-b256-fc4676a58fb4",
      type: "chapter",
      attributes: {
        volume: "6",
        chapter: "31.2",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2024-12-21T13:03:02+00:00",
        readableAt: "2024-12-21T13:03:02+00:00",
        createdAt: "2024-12-21T13:03:01+00:00",
        updatedAt: "2024-12-21T14:00:39+00:00",
        pages: 15,
        version: 4,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "9521149b-3e10-49bb-9f23-da9f5a995064",
      type: "chapter",
      attributes: {
        volume: "6",
        chapter: "32",
        title: null,
        translatedLanguage: "vi",
        externalUrl: null,
        publishAt: "2024-10-06T09:30:52+00:00",
        readableAt: "2024-10-06T09:30:52+00:00",
        createdAt: "2024-10-06T09:30:51+00:00",
        updatedAt: "2024-10-06T20:48:07+00:00",
        pages: 33,
        version: 4,
      },
      relationships: [
        {
          id: "d72094ab-d2ea-4175-ba82-227f4fe05356",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "c2966c8c-8415-417f-8180-00d13f8b5069",
          type: "user",
        },
      ],
    },
    {
      id: "17c33bda-fcf1-4a7b-9dd7-af4615a521cd",
      type: "chapter",
      attributes: {
        volume: "6",
        chapter: "32.1",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2024-12-21T13:06:22+00:00",
        readableAt: "2024-12-21T13:06:22+00:00",
        createdAt: "2024-12-21T13:06:21+00:00",
        updatedAt: "2025-01-01T13:35:57+00:00",
        pages: 12,
        version: 5,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "568ed48b-1afa-47b8-a7a5-34bbeb914447",
      type: "chapter",
      attributes: {
        volume: "6",
        chapter: "32.2",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2025-01-01T13:38:39+00:00",
        readableAt: "2025-01-01T13:38:39+00:00",
        createdAt: "2025-01-01T13:38:39+00:00",
        updatedAt: "2025-01-01T14:21:44+00:00",
        pages: 25,
        version: 4,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "6cec2d57-995e-4a96-b8d9-007d473a6406",
      type: "chapter",
      attributes: {
        volume: "6",
        chapter: "33",
        title: null,
        translatedLanguage: "vi",
        externalUrl: null,
        publishAt: "2024-10-06T09:31:17+00:00",
        readableAt: "2024-10-06T09:31:17+00:00",
        createdAt: "2024-10-06T09:31:16+00:00",
        updatedAt: "2024-10-06T20:48:07+00:00",
        pages: 38,
        version: 4,
      },
      relationships: [
        {
          id: "d72094ab-d2ea-4175-ba82-227f4fe05356",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "c2966c8c-8415-417f-8180-00d13f8b5069",
          type: "user",
        },
      ],
    },
    {
      id: "c3a68f7d-1bfd-4a4d-8428-c786a9d38ce9",
      type: "chapter",
      attributes: {
        volume: "6",
        chapter: "33.1",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2025-01-07T23:09:34+00:00",
        readableAt: "2025-01-07T23:09:34+00:00",
        createdAt: "2025-01-07T23:09:33+00:00",
        updatedAt: "2025-01-07T23:09:55+00:00",
        pages: 17,
        version: 3,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "57e3ea49-6c73-4c13-96ec-ec00faa7f86e",
      type: "chapter",
      attributes: {
        volume: "6",
        chapter: "33.2",
        title: null,
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2025-01-09T23:36:22+00:00",
        readableAt: "2025-01-09T23:36:22+00:00",
        createdAt: "2025-01-09T23:36:22+00:00",
        updatedAt: "2025-01-09T23:37:09+00:00",
        pages: 24,
        version: 3,
      },
      relationships: [
        {
          id: "04511cfa-049d-4349-96dd-693eaaa926c9",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "0b7119ee-63d5-4583-aaf7-946c3c572498",
          type: "user",
        },
      ],
    },
    {
      id: "b51593c2-a7f9-4418-b079-94d7130e4e2b",
      type: "chapter",
      attributes: {
        volume: "6",
        chapter: "34",
        title: null,
        translatedLanguage: "vi",
        externalUrl: null,
        publishAt: "2024-10-06T09:32:08+00:00",
        readableAt: "2024-10-06T09:32:08+00:00",
        createdAt: "2024-10-06T09:32:08+00:00",
        updatedAt: "2024-10-06T20:48:07+00:00",
        pages: 29,
        version: 4,
      },
      relationships: [
        {
          id: "d72094ab-d2ea-4175-ba82-227f4fe05356",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "c2966c8c-8415-417f-8180-00d13f8b5069",
          type: "user",
        },
      ],
    },
    {
      id: "93cda976-b41e-445e-af6d-982bbabaa936",
      type: "chapter",
      attributes: {
        volume: "6",
        chapter: "35",
        title: null,
        translatedLanguage: "vi",
        externalUrl: null,
        publishAt: "2024-10-06T09:32:36+00:00",
        readableAt: "2024-10-06T09:32:36+00:00",
        createdAt: "2024-10-06T09:32:35+00:00",
        updatedAt: "2024-10-06T20:48:08+00:00",
        pages: 24,
        version: 4,
      },
      relationships: [
        {
          id: "d72094ab-d2ea-4175-ba82-227f4fe05356",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "c2966c8c-8415-417f-8180-00d13f8b5069",
          type: "user",
        },
      ],
    },
    {
      id: "47dccae4-3abf-4a99-9045-25e6c278e12e",
      type: "chapter",
      attributes: {
        volume: "7",
        chapter: "36",
        title: null,
        translatedLanguage: "vi",
        externalUrl: null,
        publishAt: "2024-10-22T18:21:34+00:00",
        readableAt: "2024-10-22T18:21:34+00:00",
        createdAt: "2024-10-22T18:21:33+00:00",
        updatedAt: "2024-10-22T18:23:01+00:00",
        pages: 35,
        version: 4,
      },
      relationships: [
        {
          id: "d72094ab-d2ea-4175-ba82-227f4fe05356",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "1eba4b92-61ad-46b6-807b-ef494ffe5c19",
          type: "user",
        },
      ],
    },
    {
      id: "fdf5cccc-6c2d-43bc-af8e-b4b40ea639d5",
      type: "chapter",
      attributes: {
        volume: "7",
        chapter: "37",
        title: null,
        translatedLanguage: "vi",
        externalUrl: null,
        publishAt: "2024-11-25T13:10:26+00:00",
        readableAt: "2024-11-25T13:10:26+00:00",
        createdAt: "2024-11-25T13:10:26+00:00",
        updatedAt: "2024-11-25T13:11:11+00:00",
        pages: 29,
        version: 3,
      },
      relationships: [
        {
          id: "d72094ab-d2ea-4175-ba82-227f4fe05356",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "142f0fb0-82cc-40b5-933d-f3370c84374e",
          type: "user",
        },
      ],
    },
    {
      id: "b8752333-46e2-495c-b918-501c83c5f658",
      type: "chapter",
      attributes: {
        volume: "7",
        chapter: "38",
        title: null,
        translatedLanguage: "vi",
        externalUrl: null,
        publishAt: "2024-12-23T13:04:24+00:00",
        readableAt: "2024-12-23T13:04:24+00:00",
        createdAt: "2024-12-23T13:04:24+00:00",
        updatedAt: "2024-12-23T13:04:57+00:00",
        pages: 44,
        version: 3,
      },
      relationships: [
        {
          id: "d72094ab-d2ea-4175-ba82-227f4fe05356",
          type: "scanlation_group",
        },
        {
          id: "63fb6354-0ace-4f74-b8b8-af1be314f245",
          type: "manga",
        },
        {
          id: "142f0fb0-82cc-40b5-933d-f3370c84374e",
          type: "user",
        },
      ],
    },
  ],
  limit: 499,
  offset: 0,
  total: 168,
};
