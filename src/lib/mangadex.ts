"use server";
import { MangadexChapter } from "@/types/manga/chapter";
import { MangadexChapterImage } from "@/types/manga/chapter-image";
import { MangadexDetail } from "@/types/manga/detail";
import { Feed, MangadexFeed } from "@/types/manga/feed";
import { MangadexManga } from "@/types/manga/popular";
import { MangadexSelfPublished } from "@/types/manga/self-published";
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
    console.log(error);
    
    throw new Error("Oh hell, Something went wrong (◡︵◡)");
  }
};

export const getMangadexFeed = async (id: string): Promise<MangadexFeed> => {
  const limit = 499;
  const maxData = 5000;
  let offset = 0;
  let allData: Feed[] = [];
  let totalData = 0;
  let response: MangadexFeed | null = null;

  try {
    do {
      const endpoint = `${baseUrl}/manga/${id}/feed?limit=${limit}&offset=${offset}&order[volume]=asc&order[chapter]=asc`;
      console.log(endpoint)
      const apiResponse = await axios.get<MangadexFeed>(endpoint);
      response = apiResponse.data;
      allData = [...allData, ...response.data];
      totalData = response.total;
      offset += limit;
    } while (offset < totalData && allData.length < maxData);
    return data as MangadexFeed
    return {
      ...response,
      data: allData,
    } as MangadexFeed;

  } catch (error: any) {
    console.log(error.message);
    
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

export const getMangadexUserInlcludes = async (
  id: string
): Promise<MangadexManga> => {
  try {
    let endpoint = `${baseUrl}/list/${id}?includes[]=user`;
    const response = await axios.get<MangadexSelfPublished>(endpoint);
    const ids = response.data.data.relationships.map((data) => data.id);
    endpoint = `${baseUrl}/manga?includes[]=cover_art&limit=100&${ids
      .map((id) => `ids[]=${id}`)
      .join(
        "&"
      )}&limit=15&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&includes[]=cover_art&order[createdAt]=desc`;
    const mangaResponse = await axios.get<MangadexManga>(endpoint);
    return mangaResponse.data;
  } catch (error: any) {
    throw new Error("Oh hell, Something went wrong (◡︵◡)");
  }
};

export const getMangadexRecentlyAdded = async (): Promise<MangadexManga> => {
  try {
    const endpoint = `${baseUrl}/manga?limit=15&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&order[createdAt]=desc&includes[]=cover_art&hasAvailableChapters=true`;
    const response = await axios.get<MangadexManga>(endpoint);
    return response.data;
  } catch (error) {
    throw new Error("Oh hell, Something went wrong (◡︵◡)");
  }
};



const data = {
  "result": "ok",
  "response": "collection",
  "data": [
      {
          "id": "cdd23987-d1fb-4c5e-9b53-5712d9ffe8c5",
          "type": "chapter",
          "attributes": {
              "volume": "1",
              "chapter": "0",
              "title": null,
              "translatedLanguage": "en",
              "externalUrl": null,
              "publishAt": "2019-11-02T20:52:01+00:00",
              "readableAt": "2019-11-02T20:52:01+00:00",
              "createdAt": "2019-11-02T20:52:01+00:00",
              "updatedAt": "2023-03-30T00:21:25+00:00",
              "pages": 8,
              "version": 2
          },
          "relationships": [
              {
                  "id": "4b2b676e-6469-4930-81f7-f9dc23ad750b",
                  "type": "scanlation_group"
              },
              {
                  "id": "6b27f0ac-8ed1-45af-a24a-1a4246ec6305",
                  "type": "scanlation_group"
              },
              {
                  "id": "ab24085f-b16c-4029-8c05-38fe16592a85",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "6dc26211-4f5f-4744-9173-bfdcec75ea62",
                  "type": "user"
              }
          ]
      },
      {
          "id": "ef183cf4-525e-4b5c-9b85-af37cecf7c35",
          "type": "chapter",
          "attributes": {
              "volume": "1",
              "chapter": "1",
              "title": "",
              "translatedLanguage": "en",
              "externalUrl": null,
              "publishAt": "2020-08-10T11:54:39+00:00",
              "readableAt": "2020-08-10T11:54:39+00:00",
              "createdAt": "2020-08-10T11:54:39+00:00",
              "updatedAt": "2023-01-01T22:05:23+00:00",
              "pages": 40,
              "version": 2
          },
          "relationships": [
              {
                  "id": "4b2b676e-6469-4930-81f7-f9dc23ad750b",
                  "type": "scanlation_group"
              },
              {
                  "id": "6b27f0ac-8ed1-45af-a24a-1a4246ec6305",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "6dc26211-4f5f-4744-9173-bfdcec75ea62",
                  "type": "user"
              }
          ]
      },
      {
          "id": "23978c9f-57c6-439a-a2ba-be8134e0f608",
          "type": "chapter",
          "attributes": {
              "volume": "1",
              "chapter": "1",
              "title": null,
              "translatedLanguage": "pt-br",
              "externalUrl": null,
              "publishAt": "2022-02-23T21:54:25+00:00",
              "readableAt": "2022-02-23T21:54:25+00:00",
              "createdAt": "2022-02-23T21:54:25+00:00",
              "updatedAt": "2023-01-01T22:05:31+00:00",
              "pages": 39,
              "version": 4
          },
          "relationships": [
              {
                  "id": "0ed9f24b-450f-470f-be77-5754242c88f4",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "bc0130b2-2221-40e5-a8a2-52b37889c0a4",
                  "type": "user"
              }
          ]
      },
      {
          "id": "f58805ad-5f0d-490a-854f-2523ba2af988",
          "type": "chapter",
          "attributes": {
              "volume": "1",
              "chapter": "1",
              "title": "",
              "translatedLanguage": "id",
              "externalUrl": null,
              "publishAt": "2020-08-10T22:58:59+00:00",
              "readableAt": "2020-08-10T22:58:59+00:00",
              "createdAt": "2020-08-10T22:58:59+00:00",
              "updatedAt": "2023-01-01T22:05:23+00:00",
              "pages": 43,
              "version": 2
          },
          "relationships": [
              {
                  "id": "396c08d3-ea0f-4c4f-9752-78a51ea5d080",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "61baa102-956b-4439-b782-06114ce55d15",
                  "type": "user"
              }
          ]
      },
      {
          "id": "fe1dfc8a-b658-4115-abaf-72327bb185b6",
          "type": "chapter",
          "attributes": {
              "volume": "1",
              "chapter": "1",
              "title": "",
              "translatedLanguage": "es-la",
              "externalUrl": null,
              "publishAt": "2020-08-10T23:19:45+00:00",
              "readableAt": "2020-08-10T23:19:45+00:00",
              "createdAt": "2020-08-10T23:19:45+00:00",
              "updatedAt": "2020-08-10T23:19:45+00:00",
              "pages": 43,
              "version": 1
          },
          "relationships": [
              {
                  "id": "32b6a6fb-8382-413e-885b-0498a9207d05",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "7a287bff-b40b-4a68-87fb-c66cd775dccc",
                  "type": "user"
              }
          ]
      },
      {
          "id": "dd4896b7-c2dc-4075-8dc7-692eabbbf467",
          "type": "chapter",
          "attributes": {
              "volume": "1",
              "chapter": "1.2",
              "title": "",
              "translatedLanguage": "id",
              "externalUrl": null,
              "publishAt": "2020-08-12T00:33:25+00:00",
              "readableAt": "2020-08-12T00:33:25+00:00",
              "createdAt": "2020-08-12T00:33:25+00:00",
              "updatedAt": "2023-01-01T22:05:24+00:00",
              "pages": 23,
              "version": 2
          },
          "relationships": [
              {
                  "id": "396c08d3-ea0f-4c4f-9752-78a51ea5d080",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "61baa102-956b-4439-b782-06114ce55d15",
                  "type": "user"
              }
          ]
      },
      {
          "id": "4e0fd803-b79c-42fc-91d9-548e4e0afb01",
          "type": "chapter",
          "attributes": {
              "volume": "1",
              "chapter": "2",
              "title": "",
              "translatedLanguage": "ru",
              "externalUrl": null,
              "publishAt": "2021-01-25T20:29:33+00:00",
              "readableAt": "2021-01-25T20:29:33+00:00",
              "createdAt": "2021-01-25T20:29:33+00:00",
              "updatedAt": "2023-01-01T22:05:26+00:00",
              "pages": 30,
              "version": 2
          },
          "relationships": [
              {
                  "id": "9e6928bf-4083-453d-9a00-e07dc15963c8",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "36352252-5c66-4aa6-9afd-9b0fb92ae17d",
                  "type": "user"
              }
          ]
      },
      {
          "id": "92dd9566-a0c1-407b-845a-6d6f94ad69a7",
          "type": "chapter",
          "attributes": {
              "volume": "1",
              "chapter": "2",
              "title": "",
              "translatedLanguage": "id",
              "externalUrl": null,
              "publishAt": "2020-10-20T04:31:46+00:00",
              "readableAt": "2020-10-20T04:31:46+00:00",
              "createdAt": "2020-10-20T04:31:46+00:00",
              "updatedAt": "2023-01-01T22:05:24+00:00",
              "pages": 32,
              "version": 2
          },
          "relationships": [
              {
                  "id": "396c08d3-ea0f-4c4f-9752-78a51ea5d080",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "61baa102-956b-4439-b782-06114ce55d15",
                  "type": "user"
              }
          ]
      },
      {
          "id": "4843e9c5-ab3e-48e8-b557-374eedb22dfb",
          "type": "chapter",
          "attributes": {
              "volume": "1",
              "chapter": "2",
              "title": "",
              "translatedLanguage": "en",
              "externalUrl": null,
              "publishAt": "2020-09-23T23:51:13+00:00",
              "readableAt": "2020-09-23T23:51:13+00:00",
              "createdAt": "2020-09-23T23:51:13+00:00",
              "updatedAt": "2023-01-01T22:05:24+00:00",
              "pages": 30,
              "version": 2
          },
          "relationships": [
              {
                  "id": "4b2b676e-6469-4930-81f7-f9dc23ad750b",
                  "type": "scanlation_group"
              },
              {
                  "id": "6b27f0ac-8ed1-45af-a24a-1a4246ec6305",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "6dc26211-4f5f-4744-9173-bfdcec75ea62",
                  "type": "user"
              }
          ]
      },
      {
          "id": "54a48981-3f8b-4aa3-be45-ee5036d2a47d",
          "type": "chapter",
          "attributes": {
              "volume": "1",
              "chapter": "2",
              "title": null,
              "translatedLanguage": "pt-br",
              "externalUrl": null,
              "publishAt": "2022-02-23T21:56:25+00:00",
              "readableAt": "2022-02-23T21:56:25+00:00",
              "createdAt": "2022-02-23T21:56:25+00:00",
              "updatedAt": "2023-01-01T22:05:31+00:00",
              "pages": 31,
              "version": 4
          },
          "relationships": [
              {
                  "id": "0ed9f24b-450f-470f-be77-5754242c88f4",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "bc0130b2-2221-40e5-a8a2-52b37889c0a4",
                  "type": "user"
              }
          ]
      },
      {
          "id": "dfc9e439-ee20-435f-9109-c03506681990",
          "type": "chapter",
          "attributes": {
              "volume": "1",
              "chapter": "2",
              "title": "",
              "translatedLanguage": "es-la",
              "externalUrl": null,
              "publishAt": "2020-10-20T04:48:34+00:00",
              "readableAt": "2020-10-20T04:48:34+00:00",
              "createdAt": "2020-10-20T04:48:34+00:00",
              "updatedAt": "2020-10-20T04:48:34+00:00",
              "pages": 35,
              "version": 1
          },
          "relationships": [
              {
                  "id": "32b6a6fb-8382-413e-885b-0498a9207d05",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "7a287bff-b40b-4a68-87fb-c66cd775dccc",
                  "type": "user"
              }
          ]
      },
      {
          "id": "b5956edd-4c73-4e22-9f04-946cd72f4db1",
          "type": "chapter",
          "attributes": {
              "volume": "1",
              "chapter": "3",
              "title": null,
              "translatedLanguage": "pt-br",
              "externalUrl": null,
              "publishAt": "2022-02-23T21:58:30+00:00",
              "readableAt": "2022-02-23T21:58:30+00:00",
              "createdAt": "2022-02-23T21:58:30+00:00",
              "updatedAt": "2023-01-01T22:05:32+00:00",
              "pages": 43,
              "version": 4
          },
          "relationships": [
              {
                  "id": "0ed9f24b-450f-470f-be77-5754242c88f4",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "bc0130b2-2221-40e5-a8a2-52b37889c0a4",
                  "type": "user"
              }
          ]
      },
      {
          "id": "53e15798-6c10-42bc-b8b4-3d16ce784b5f",
          "type": "chapter",
          "attributes": {
              "volume": "1",
              "chapter": "3.1",
              "title": "",
              "translatedLanguage": "es-la",
              "externalUrl": null,
              "publishAt": "2020-12-20T15:06:14+00:00",
              "readableAt": "2020-12-20T15:06:14+00:00",
              "createdAt": "2020-12-20T15:06:14+00:00",
              "updatedAt": "2020-12-20T15:06:14+00:00",
              "pages": 20,
              "version": 1
          },
          "relationships": [
              {
                  "id": "32b6a6fb-8382-413e-885b-0498a9207d05",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "7a287bff-b40b-4a68-87fb-c66cd775dccc",
                  "type": "user"
              }
          ]
      },
      {
          "id": "2097d97c-31c8-489d-8eea-63fb7ae066ee",
          "type": "chapter",
          "attributes": {
              "volume": "1",
              "chapter": "3.1",
              "title": "",
              "translatedLanguage": "ru",
              "externalUrl": null,
              "publishAt": "2021-01-25T20:31:13+00:00",
              "readableAt": "2021-01-25T20:31:13+00:00",
              "createdAt": "2021-01-25T20:31:13+00:00",
              "updatedAt": "2023-01-01T22:05:27+00:00",
              "pages": 13,
              "version": 2
          },
          "relationships": [
              {
                  "id": "9e6928bf-4083-453d-9a00-e07dc15963c8",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "36352252-5c66-4aa6-9afd-9b0fb92ae17d",
                  "type": "user"
              }
          ]
      },
      {
          "id": "ea066e90-aca4-4cf9-9d18-fce1096990d0",
          "type": "chapter",
          "attributes": {
              "volume": "1",
              "chapter": "3.1",
              "title": "",
              "translatedLanguage": "en",
              "externalUrl": null,
              "publishAt": "2020-12-20T01:36:28+00:00",
              "readableAt": "2020-12-20T01:36:28+00:00",
              "createdAt": "2020-12-20T01:36:28+00:00",
              "updatedAt": "2023-01-01T22:05:25+00:00",
              "pages": 13,
              "version": 2
          },
          "relationships": [
              {
                  "id": "4b2b676e-6469-4930-81f7-f9dc23ad750b",
                  "type": "scanlation_group"
              },
              {
                  "id": "6b27f0ac-8ed1-45af-a24a-1a4246ec6305",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "6dc26211-4f5f-4744-9173-bfdcec75ea62",
                  "type": "user"
              }
          ]
      },
      {
          "id": "350eb44e-9f34-4fa2-9b7f-236d6242e731",
          "type": "chapter",
          "attributes": {
              "volume": "1",
              "chapter": "3.2",
              "title": "",
              "translatedLanguage": "ru",
              "externalUrl": null,
              "publishAt": "2021-01-25T20:31:34+00:00",
              "readableAt": "2021-01-25T20:31:34+00:00",
              "createdAt": "2021-01-25T20:31:34+00:00",
              "updatedAt": "2023-01-01T22:05:27+00:00",
              "pages": 12,
              "version": 2
          },
          "relationships": [
              {
                  "id": "9e6928bf-4083-453d-9a00-e07dc15963c8",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "36352252-5c66-4aa6-9afd-9b0fb92ae17d",
                  "type": "user"
              }
          ]
      },
      {
          "id": "7ca5e692-5ead-408b-8523-c1cd06d1c0ae",
          "type": "chapter",
          "attributes": {
              "volume": "1",
              "chapter": "3.2",
              "title": "",
              "translatedLanguage": "es-la",
              "externalUrl": null,
              "publishAt": "2020-12-30T15:10:42+00:00",
              "readableAt": "2020-12-30T15:10:42+00:00",
              "createdAt": "2020-12-30T15:10:42+00:00",
              "updatedAt": "2023-01-01T22:05:26+00:00",
              "pages": 19,
              "version": 2
          },
          "relationships": [
              {
                  "id": "32b6a6fb-8382-413e-885b-0498a9207d05",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "7a287bff-b40b-4a68-87fb-c66cd775dccc",
                  "type": "user"
              }
          ]
      },
      {
          "id": "e1ec809d-2b73-4b01-b3c2-d7126daa5b2c",
          "type": "chapter",
          "attributes": {
              "volume": "1",
              "chapter": "3.2",
              "title": "",
              "translatedLanguage": "en",
              "externalUrl": null,
              "publishAt": "2020-12-29T01:27:24+00:00",
              "readableAt": "2020-12-29T01:27:24+00:00",
              "createdAt": "2020-12-29T01:27:24+00:00",
              "updatedAt": "2023-01-01T22:05:25+00:00",
              "pages": 12,
              "version": 2
          },
          "relationships": [
              {
                  "id": "4b2b676e-6469-4930-81f7-f9dc23ad750b",
                  "type": "scanlation_group"
              },
              {
                  "id": "6b27f0ac-8ed1-45af-a24a-1a4246ec6305",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "6dc26211-4f5f-4744-9173-bfdcec75ea62",
                  "type": "user"
              }
          ]
      },
      {
          "id": "cd2d5543-1373-4ac7-a61a-039d343ba939",
          "type": "chapter",
          "attributes": {
              "volume": "1",
              "chapter": "3.3",
              "title": "",
              "translatedLanguage": "en",
              "externalUrl": null,
              "publishAt": "2021-01-27T22:12:34+00:00",
              "readableAt": "2021-01-27T22:12:34+00:00",
              "createdAt": "2021-01-27T22:12:34+00:00",
              "updatedAt": "2023-01-01T22:05:27+00:00",
              "pages": 19,
              "version": 2
          },
          "relationships": [
              {
                  "id": "4b2b676e-6469-4930-81f7-f9dc23ad750b",
                  "type": "scanlation_group"
              },
              {
                  "id": "6b27f0ac-8ed1-45af-a24a-1a4246ec6305",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "6dc26211-4f5f-4744-9173-bfdcec75ea62",
                  "type": "user"
              }
          ]
      },
      {
          "id": "d43ebdc0-2fee-4c5e-b5e7-2f2c8d05d01b",
          "type": "chapter",
          "attributes": {
              "volume": "1",
              "chapter": "3.3",
              "title": "",
              "translatedLanguage": "es-la",
              "externalUrl": null,
              "publishAt": "2021-01-31T17:02:34+00:00",
              "readableAt": "2021-01-31T17:02:34+00:00",
              "createdAt": "2021-01-31T17:02:34+00:00",
              "updatedAt": "2023-01-01T22:05:28+00:00",
              "pages": 27,
              "version": 2
          },
          "relationships": [
              {
                  "id": "32b6a6fb-8382-413e-885b-0498a9207d05",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "7a287bff-b40b-4a68-87fb-c66cd775dccc",
                  "type": "user"
              }
          ]
      },
      {
          "id": "d77a17a6-0f49-4295-b5d2-6bd0c2177810",
          "type": "chapter",
          "attributes": {
              "volume": "1",
              "chapter": "3.3",
              "title": "",
              "translatedLanguage": "ru",
              "externalUrl": null,
              "publishAt": "2021-02-22T13:25:53+00:00",
              "readableAt": "2021-02-22T13:25:53+00:00",
              "createdAt": "2021-02-22T13:25:53+00:00",
              "updatedAt": "2023-01-01T22:05:28+00:00",
              "pages": 19,
              "version": 2
          },
          "relationships": [
              {
                  "id": "9e6928bf-4083-453d-9a00-e07dc15963c8",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "36352252-5c66-4aa6-9afd-9b0fb92ae17d",
                  "type": "user"
              }
          ]
      },
      {
          "id": "4c91440d-4bda-4067-8274-58e9e2b91d2d",
          "type": "chapter",
          "attributes": {
              "volume": "1",
              "chapter": "4.1",
              "title": "",
              "translatedLanguage": "ru",
              "externalUrl": null,
              "publishAt": "2021-03-08T11:10:01+00:00",
              "readableAt": "2021-03-08T11:10:01+00:00",
              "createdAt": "2021-03-08T11:10:01+00:00",
              "updatedAt": "2023-01-01T22:05:29+00:00",
              "pages": 19,
              "version": 2
          },
          "relationships": [
              {
                  "id": "9e6928bf-4083-453d-9a00-e07dc15963c8",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "36352252-5c66-4aa6-9afd-9b0fb92ae17d",
                  "type": "user"
              }
          ]
      },
      {
          "id": "3aaef03a-d497-487c-8e17-5c71da55c689",
          "type": "chapter",
          "attributes": {
              "volume": "1",
              "chapter": "4.1",
              "title": "",
              "translatedLanguage": "es-la",
              "externalUrl": null,
              "publishAt": "2021-03-14T05:10:06+00:00",
              "readableAt": "2021-03-14T05:10:06+00:00",
              "createdAt": "2021-03-14T05:10:06+00:00",
              "updatedAt": "2023-01-01T22:05:29+00:00",
              "pages": 26,
              "version": 2
          },
          "relationships": [
              {
                  "id": "32b6a6fb-8382-413e-885b-0498a9207d05",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "7a287bff-b40b-4a68-87fb-c66cd775dccc",
                  "type": "user"
              }
          ]
      },
      {
          "id": "5e6466ad-80c4-41e4-92ec-67642d90615e",
          "type": "chapter",
          "attributes": {
              "volume": "1",
              "chapter": "4.1",
              "title": "",
              "translatedLanguage": "en",
              "externalUrl": null,
              "publishAt": "2021-03-04T01:17:18+00:00",
              "readableAt": "2021-03-04T01:17:18+00:00",
              "createdAt": "2021-03-04T01:17:18+00:00",
              "updatedAt": "2023-01-01T22:05:29+00:00",
              "pages": 19,
              "version": 2
          },
          "relationships": [
              {
                  "id": "4b2b676e-6469-4930-81f7-f9dc23ad750b",
                  "type": "scanlation_group"
              },
              {
                  "id": "6b27f0ac-8ed1-45af-a24a-1a4246ec6305",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "6dc26211-4f5f-4744-9173-bfdcec75ea62",
                  "type": "user"
              }
          ]
      },
      {
          "id": "b339c237-1151-4063-bc3e-69c02b947d22",
          "type": "chapter",
          "attributes": {
              "volume": "1",
              "chapter": "4.1",
              "title": null,
              "translatedLanguage": "pt-br",
              "externalUrl": null,
              "publishAt": "2022-02-23T22:00:46+00:00",
              "readableAt": "2022-02-23T22:00:46+00:00",
              "createdAt": "2022-02-23T22:00:45+00:00",
              "updatedAt": "2023-01-01T22:05:32+00:00",
              "pages": 20,
              "version": 4
          },
          "relationships": [
              {
                  "id": "0ed9f24b-450f-470f-be77-5754242c88f4",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "bc0130b2-2221-40e5-a8a2-52b37889c0a4",
                  "type": "user"
              }
          ]
      },
      {
          "id": "2b2820bb-424c-4fb4-bed8-5bd9a119057e",
          "type": "chapter",
          "attributes": {
              "volume": "1",
              "chapter": "4.2",
              "title": null,
              "translatedLanguage": "pt-br",
              "externalUrl": null,
              "publishAt": "2022-02-23T22:02:13+00:00",
              "readableAt": "2022-02-23T22:02:13+00:00",
              "createdAt": "2022-02-23T22:02:13+00:00",
              "updatedAt": "2023-01-01T22:05:33+00:00",
              "pages": 25,
              "version": 4
          },
          "relationships": [
              {
                  "id": "0ed9f24b-450f-470f-be77-5754242c88f4",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "bc0130b2-2221-40e5-a8a2-52b37889c0a4",
                  "type": "user"
              }
          ]
      },
      {
          "id": "5eac73c5-2538-4f07-ba02-6650a4306322",
          "type": "chapter",
          "attributes": {
              "volume": "1",
              "chapter": "4.2",
              "title": null,
              "translatedLanguage": "ru",
              "externalUrl": null,
              "publishAt": "2021-10-20T10:14:14+00:00",
              "readableAt": "2021-10-20T10:14:14+00:00",
              "createdAt": "2021-10-20T10:14:14+00:00",
              "updatedAt": "2023-01-01T22:05:30+00:00",
              "pages": 24,
              "version": 4
          },
          "relationships": [
              {
                  "id": "9e6928bf-4083-453d-9a00-e07dc15963c8",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "36352252-5c66-4aa6-9afd-9b0fb92ae17d",
                  "type": "user"
              }
          ]
      },
      {
          "id": "4d1864ed-bbbe-4f0a-be5c-00187b5dc2c3",
          "type": "chapter",
          "attributes": {
              "volume": "1",
              "chapter": "4.2",
              "title": null,
              "translatedLanguage": "en",
              "externalUrl": null,
              "publishAt": "2021-07-08T08:36:19+00:00",
              "readableAt": "2021-07-08T08:36:19+00:00",
              "createdAt": "2021-07-08T08:36:19+00:00",
              "updatedAt": "2023-01-01T22:05:30+00:00",
              "pages": 24,
              "version": 4
          },
          "relationships": [
              {
                  "id": "4b2b676e-6469-4930-81f7-f9dc23ad750b",
                  "type": "scanlation_group"
              },
              {
                  "id": "6b27f0ac-8ed1-45af-a24a-1a4246ec6305",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "6dc26211-4f5f-4744-9173-bfdcec75ea62",
                  "type": "user"
              }
          ]
      },
      {
          "id": "a58f627c-ba4f-4856-8f25-cf9d1d08d5fd",
          "type": "chapter",
          "attributes": {
              "volume": null,
              "chapter": "0",
              "title": "",
              "translatedLanguage": "pt-br",
              "externalUrl": null,
              "publishAt": "2020-09-30T21:35:43+00:00",
              "readableAt": "2020-09-30T21:35:43+00:00",
              "createdAt": "2020-09-30T21:35:43+00:00",
              "updatedAt": "2020-09-30T21:35:43+00:00",
              "pages": 9,
              "version": 1
          },
          "relationships": [
              {
                  "id": "4041d000-2dbe-444a-a682-6e6717915b62",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "afb590cd-a986-42a5-aa77-5cd74844dd8b",
                  "type": "user"
              }
          ]
      },
      {
          "id": "0f2b78e5-7781-4620-8474-f6326f74e978",
          "type": "chapter",
          "attributes": {
              "volume": null,
              "chapter": "0",
              "title": "Пролог",
              "translatedLanguage": "ru",
              "externalUrl": null,
              "publishAt": "2019-11-11T18:59:40+00:00",
              "readableAt": "2019-11-11T18:59:40+00:00",
              "createdAt": "2019-11-11T18:59:40+00:00",
              "updatedAt": "2019-11-11T18:59:40+00:00",
              "pages": 9,
              "version": 1
          },
          "relationships": [
              {
                  "id": "0b80a355-396a-4cf6-9c1c-1ceeaad39964",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "5d322dcb-3605-4a9d-b399-1d9dc185b22e",
                  "type": "user"
              }
          ]
      },
      {
          "id": "45aff944-372a-40ef-842d-671c8eb6606d",
          "type": "chapter",
          "attributes": {
              "volume": null,
              "chapter": "0",
              "title": "",
              "translatedLanguage": "id",
              "externalUrl": null,
              "publishAt": "2019-11-03T05:09:49+00:00",
              "readableAt": "2019-11-03T05:09:49+00:00",
              "createdAt": "2019-11-03T05:09:49+00:00",
              "updatedAt": "2019-11-03T05:09:49+00:00",
              "pages": 11,
              "version": 1
          },
          "relationships": [
              {
                  "id": "396c08d3-ea0f-4c4f-9752-78a51ea5d080",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "61baa102-956b-4439-b782-06114ce55d15",
                  "type": "user"
              }
          ]
      },
      {
          "id": "fd7d6dae-4691-4088-916c-7485e2afc64c",
          "type": "chapter",
          "attributes": {
              "volume": null,
              "chapter": "0",
              "title": "",
              "translatedLanguage": "es-la",
              "externalUrl": null,
              "publishAt": "2019-11-02T22:08:01+00:00",
              "readableAt": "2019-11-02T22:08:01+00:00",
              "createdAt": "2019-11-02T22:08:01+00:00",
              "updatedAt": "2019-11-02T22:08:01+00:00",
              "pages": 9,
              "version": 1
          },
          "relationships": [
              {
                  "id": "27e6817d-9613-4475-a995-203c217c8fdf",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "bd79ffe6-139a-4868-8bea-12793e540c67",
                  "type": "user"
              }
          ]
      },
      {
          "id": "b3a052ad-bd08-42bb-a07c-9218910afda9",
          "type": "chapter",
          "attributes": {
              "volume": null,
              "chapter": "5.1",
              "title": null,
              "translatedLanguage": "ru",
              "externalUrl": null,
              "publishAt": "2022-02-23T16:04:16+00:00",
              "readableAt": "2022-02-23T16:04:16+00:00",
              "createdAt": "2022-02-23T16:04:16+00:00",
              "updatedAt": "2022-02-23T16:04:31+00:00",
              "pages": 19,
              "version": 3
          },
          "relationships": [
              {
                  "id": "9e6928bf-4083-453d-9a00-e07dc15963c8",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "36352252-5c66-4aa6-9afd-9b0fb92ae17d",
                  "type": "user"
              }
          ]
      },
      {
          "id": "2963a46d-8483-4fb6-aa77-2a408994e10f",
          "type": "chapter",
          "attributes": {
              "volume": null,
              "chapter": "5.1",
              "title": null,
              "translatedLanguage": "pt-br",
              "externalUrl": null,
              "publishAt": "2022-09-02T04:54:10+00:00",
              "readableAt": "2022-09-02T04:54:10+00:00",
              "createdAt": "2022-09-02T04:54:09+00:00",
              "updatedAt": "2022-09-02T04:54:15+00:00",
              "pages": 19,
              "version": 3
          },
          "relationships": [
              {
                  "id": "0ed9f24b-450f-470f-be77-5754242c88f4",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "bc0130b2-2221-40e5-a8a2-52b37889c0a4",
                  "type": "user"
              }
          ]
      },
      {
          "id": "2b106093-f82a-430d-92c8-75e879cc21cb",
          "type": "chapter",
          "attributes": {
              "volume": null,
              "chapter": "5.1",
              "title": null,
              "translatedLanguage": "en",
              "externalUrl": null,
              "publishAt": "2022-04-07T07:59:57+00:00",
              "readableAt": "2022-04-07T07:59:57+00:00",
              "createdAt": "2022-04-07T07:59:57+00:00",
              "updatedAt": "2022-04-07T08:00:24+00:00",
              "pages": 20,
              "version": 3
          },
          "relationships": [
              {
                  "id": "4209a4a9-b838-4817-be40-0c8ef2f7be4a",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "6d0ca397-136d-4448-ae5d-895c2c504472",
                  "type": "user"
              }
          ]
      },
      {
          "id": "e3b81434-d020-49ea-adbc-be13627b76c5",
          "type": "chapter",
          "attributes": {
              "volume": null,
              "chapter": "5.2",
              "title": null,
              "translatedLanguage": "en",
              "externalUrl": null,
              "publishAt": "2022-04-13T13:04:31+00:00",
              "readableAt": "2022-04-13T13:04:31+00:00",
              "createdAt": "2022-04-13T13:04:31+00:00",
              "updatedAt": "2022-04-13T13:04:40+00:00",
              "pages": 9,
              "version": 3
          },
          "relationships": [
              {
                  "id": "4209a4a9-b838-4817-be40-0c8ef2f7be4a",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "6d0ca397-136d-4448-ae5d-895c2c504472",
                  "type": "user"
              }
          ]
      },
      {
          "id": "cbd3c21c-2036-4e8c-a875-e08e272d069b",
          "type": "chapter",
          "attributes": {
              "volume": null,
              "chapter": "5.2",
              "title": null,
              "translatedLanguage": "ru",
              "externalUrl": null,
              "publishAt": "2022-04-07T08:23:50+00:00",
              "readableAt": "2022-04-07T08:23:50+00:00",
              "createdAt": "2022-04-07T08:23:50+00:00",
              "updatedAt": "2022-04-07T08:23:53+00:00",
              "pages": 8,
              "version": 3
          },
          "relationships": [
              {
                  "id": "9e6928bf-4083-453d-9a00-e07dc15963c8",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "36352252-5c66-4aa6-9afd-9b0fb92ae17d",
                  "type": "user"
              }
          ]
      },
      {
          "id": "bb76afa3-dd1e-49c9-90bd-671d08bd9e14",
          "type": "chapter",
          "attributes": {
              "volume": null,
              "chapter": "5.2",
              "title": null,
              "translatedLanguage": "pt-br",
              "externalUrl": null,
              "publishAt": "2022-09-02T04:54:41+00:00",
              "readableAt": "2022-09-02T04:54:41+00:00",
              "createdAt": "2022-09-02T04:54:41+00:00",
              "updatedAt": "2022-09-02T04:54:46+00:00",
              "pages": 9,
              "version": 3
          },
          "relationships": [
              {
                  "id": "0ed9f24b-450f-470f-be77-5754242c88f4",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "bc0130b2-2221-40e5-a8a2-52b37889c0a4",
                  "type": "user"
              }
          ]
      },
      {
          "id": "76b36c2c-9eca-47bf-a4cf-2f4033f22060",
          "type": "chapter",
          "attributes": {
              "volume": null,
              "chapter": "5.3",
              "title": null,
              "translatedLanguage": "en",
              "externalUrl": null,
              "publishAt": "2022-04-19T04:37:25+00:00",
              "readableAt": "2022-04-19T04:37:25+00:00",
              "createdAt": "2022-04-19T04:37:25+00:00",
              "updatedAt": "2022-04-19T04:37:40+00:00",
              "pages": 15,
              "version": 3
          },
          "relationships": [
              {
                  "id": "4209a4a9-b838-4817-be40-0c8ef2f7be4a",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "6d0ca397-136d-4448-ae5d-895c2c504472",
                  "type": "user"
              }
          ]
      },
      {
          "id": "8f074e5f-6e91-4e1b-8fb8-a471b3cbab9a",
          "type": "chapter",
          "attributes": {
              "volume": null,
              "chapter": "5.3",
              "title": null,
              "translatedLanguage": "ru",
              "externalUrl": null,
              "publishAt": "2022-05-01T16:09:24+00:00",
              "readableAt": "2022-05-01T16:09:24+00:00",
              "createdAt": "2022-05-01T16:09:24+00:00",
              "updatedAt": "2022-05-01T16:09:30+00:00",
              "pages": 14,
              "version": 3
          },
          "relationships": [
              {
                  "id": "9e6928bf-4083-453d-9a00-e07dc15963c8",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "36352252-5c66-4aa6-9afd-9b0fb92ae17d",
                  "type": "user"
              }
          ]
      },
      {
          "id": "e6228181-df7b-47ad-a92e-255acf358f92",
          "type": "chapter",
          "attributes": {
              "volume": null,
              "chapter": "5.3",
              "title": null,
              "translatedLanguage": "pt-br",
              "externalUrl": null,
              "publishAt": "2022-09-02T04:55:15+00:00",
              "readableAt": "2022-09-02T04:55:15+00:00",
              "createdAt": "2022-09-02T04:55:15+00:00",
              "updatedAt": "2022-09-02T04:55:24+00:00",
              "pages": 14,
              "version": 3
          },
          "relationships": [
              {
                  "id": "0ed9f24b-450f-470f-be77-5754242c88f4",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "bc0130b2-2221-40e5-a8a2-52b37889c0a4",
                  "type": "user"
              }
          ]
      },
      {
          "id": "0be6a070-766e-4a01-a73a-54d4bbf062a6",
          "type": "chapter",
          "attributes": {
              "volume": null,
              "chapter": "6.1",
              "title": null,
              "translatedLanguage": "ru",
              "externalUrl": null,
              "publishAt": "2022-10-20T19:12:21+00:00",
              "readableAt": "2022-10-20T19:12:21+00:00",
              "createdAt": "2022-10-20T19:12:20+00:00",
              "updatedAt": "2022-10-20T19:12:29+00:00",
              "pages": 10,
              "version": 3
          },
          "relationships": [
              {
                  "id": "9e6928bf-4083-453d-9a00-e07dc15963c8",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "36352252-5c66-4aa6-9afd-9b0fb92ae17d",
                  "type": "user"
              }
          ]
      },
      {
          "id": "f328258f-a13f-4985-814b-3597b4d9349d",
          "type": "chapter",
          "attributes": {
              "volume": null,
              "chapter": "6.1",
              "title": null,
              "translatedLanguage": "en",
              "externalUrl": null,
              "publishAt": "2022-10-16T06:41:49+00:00",
              "readableAt": "2022-10-16T06:41:49+00:00",
              "createdAt": "2022-10-16T06:41:49+00:00",
              "updatedAt": "2022-10-16T06:42:17+00:00",
              "pages": 11,
              "version": 3
          },
          "relationships": [
              {
                  "id": "4209a4a9-b838-4817-be40-0c8ef2f7be4a",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "6d0ca397-136d-4448-ae5d-895c2c504472",
                  "type": "user"
              }
          ]
      },
      {
          "id": "88adefe9-1734-4457-a721-06a644a76c2e",
          "type": "chapter",
          "attributes": {
              "volume": null,
              "chapter": "6.2",
              "title": null,
              "translatedLanguage": "en",
              "externalUrl": null,
              "publishAt": "2022-11-02T03:36:19+00:00",
              "readableAt": "2022-11-02T03:36:19+00:00",
              "createdAt": "2022-11-02T03:36:18+00:00",
              "updatedAt": "2022-11-02T03:36:46+00:00",
              "pages": 14,
              "version": 3
          },
          "relationships": [
              {
                  "id": "4209a4a9-b838-4817-be40-0c8ef2f7be4a",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "6d0ca397-136d-4448-ae5d-895c2c504472",
                  "type": "user"
              }
          ]
      },
      {
          "id": "d8c7cc90-61b1-484b-a987-e7cbdc4d080e",
          "type": "chapter",
          "attributes": {
              "volume": null,
              "chapter": "6.2",
              "title": null,
              "translatedLanguage": "ru",
              "externalUrl": null,
              "publishAt": "2022-11-21T16:14:28+00:00",
              "readableAt": "2022-11-21T16:14:28+00:00",
              "createdAt": "2022-11-21T16:14:27+00:00",
              "updatedAt": "2022-11-21T16:14:38+00:00",
              "pages": 13,
              "version": 3
          },
          "relationships": [
              {
                  "id": "9e6928bf-4083-453d-9a00-e07dc15963c8",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "36352252-5c66-4aa6-9afd-9b0fb92ae17d",
                  "type": "user"
              }
          ]
      },
      {
          "id": "53965198-0c19-4119-9a19-d2bb7eacdf97",
          "type": "chapter",
          "attributes": {
              "volume": null,
              "chapter": "6.3",
              "title": null,
              "translatedLanguage": "en",
              "externalUrl": null,
              "publishAt": "2022-12-30T02:00:48+00:00",
              "readableAt": "2022-12-30T02:00:48+00:00",
              "createdAt": "2022-12-30T02:00:47+00:00",
              "updatedAt": "2022-12-30T02:01:25+00:00",
              "pages": 12,
              "version": 3
          },
          "relationships": [
              {
                  "id": "4209a4a9-b838-4817-be40-0c8ef2f7be4a",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "6d0ca397-136d-4448-ae5d-895c2c504472",
                  "type": "user"
              }
          ]
      },
      {
          "id": "3698f403-a0d3-4f9e-9042-269f4dfa0949",
          "type": "chapter",
          "attributes": {
              "volume": null,
              "chapter": "6.3",
              "title": null,
              "translatedLanguage": "ru",
              "externalUrl": null,
              "publishAt": "2022-11-21T16:14:56+00:00",
              "readableAt": "2022-11-21T16:14:56+00:00",
              "createdAt": "2022-11-21T16:14:56+00:00",
              "updatedAt": "2022-11-21T16:15:06+00:00",
              "pages": 11,
              "version": 3
          },
          "relationships": [
              {
                  "id": "9e6928bf-4083-453d-9a00-e07dc15963c8",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "36352252-5c66-4aa6-9afd-9b0fb92ae17d",
                  "type": "user"
              }
          ]
      },
      {
          "id": "0dc358b8-7930-4999-900b-450fb03877ac",
          "type": "chapter",
          "attributes": {
              "volume": null,
              "chapter": "6.4",
              "title": null,
              "translatedLanguage": "ru",
              "externalUrl": null,
              "publishAt": "2022-12-31T22:44:13+00:00",
              "readableAt": "2022-12-31T22:44:13+00:00",
              "createdAt": "2022-12-31T22:44:12+00:00",
              "updatedAt": "2022-12-31T22:44:18+00:00",
              "pages": 8,
              "version": 3
          },
          "relationships": [
              {
                  "id": "9e6928bf-4083-453d-9a00-e07dc15963c8",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "36352252-5c66-4aa6-9afd-9b0fb92ae17d",
                  "type": "user"
              }
          ]
      },
      {
          "id": "7f357b2e-3b8c-4050-ad4d-48ed873b0eae",
          "type": "chapter",
          "attributes": {
              "volume": null,
              "chapter": "6.4",
              "title": null,
              "translatedLanguage": "en",
              "externalUrl": null,
              "publishAt": "2023-04-11T05:52:23+00:00",
              "readableAt": "2023-04-11T05:52:23+00:00",
              "createdAt": "2023-04-11T05:52:22+00:00",
              "updatedAt": "2023-04-11T05:52:38+00:00",
              "pages": 9,
              "version": 3
          },
          "relationships": [
              {
                  "id": "4209a4a9-b838-4817-be40-0c8ef2f7be4a",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "6d0ca397-136d-4448-ae5d-895c2c504472",
                  "type": "user"
              }
          ]
      },
      {
          "id": "3b2e5a2b-971e-4e1d-a854-09acdbf0c01d",
          "type": "chapter",
          "attributes": {
              "volume": null,
              "chapter": "6.5",
              "title": null,
              "translatedLanguage": "ru",
              "externalUrl": null,
              "publishAt": "2022-12-31T22:45:34+00:00",
              "readableAt": "2022-12-31T22:45:34+00:00",
              "createdAt": "2022-12-31T22:45:34+00:00",
              "updatedAt": "2022-12-31T22:45:42+00:00",
              "pages": 8,
              "version": 3
          },
          "relationships": [
              {
                  "id": "9e6928bf-4083-453d-9a00-e07dc15963c8",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "36352252-5c66-4aa6-9afd-9b0fb92ae17d",
                  "type": "user"
              }
          ]
      },
      {
          "id": "ca7f2bc9-9914-4f2d-aeea-9aceb178ace5",
          "type": "chapter",
          "attributes": {
              "volume": null,
              "chapter": "6.5",
              "title": null,
              "translatedLanguage": "en",
              "externalUrl": null,
              "publishAt": "2024-05-29T11:40:58+00:00",
              "readableAt": "2024-05-29T11:40:58+00:00",
              "createdAt": "2024-05-29T11:40:57+00:00",
              "updatedAt": "2024-05-29T11:41:33+00:00",
              "pages": 9,
              "version": 3
          },
          "relationships": [
              {
                  "id": "4209a4a9-b838-4817-be40-0c8ef2f7be4a",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "a843a877-1f79-4d91-aac0-65e199c7ffc6",
                  "type": "user"
              }
          ]
      },
      {
          "id": "f80338c4-d2cc-48be-95f5-f8dfe543aada",
          "type": "chapter",
          "attributes": {
              "volume": null,
              "chapter": "7.1",
              "title": null,
              "translatedLanguage": "en",
              "externalUrl": null,
              "publishAt": "2024-05-29T11:42:02+00:00",
              "readableAt": "2024-05-29T11:42:02+00:00",
              "createdAt": "2024-05-29T11:42:02+00:00",
              "updatedAt": "2024-05-29T11:42:24+00:00",
              "pages": 11,
              "version": 3
          },
          "relationships": [
              {
                  "id": "4209a4a9-b838-4817-be40-0c8ef2f7be4a",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "a843a877-1f79-4d91-aac0-65e199c7ffc6",
                  "type": "user"
              }
          ]
      },
      {
          "id": "e1253033-cb66-4af8-91cb-1df28ce71e86",
          "type": "chapter",
          "attributes": {
              "volume": null,
              "chapter": "7.2",
              "title": null,
              "translatedLanguage": "en",
              "externalUrl": null,
              "publishAt": "2024-05-29T11:42:49+00:00",
              "readableAt": "2024-05-29T11:42:49+00:00",
              "createdAt": "2024-05-29T11:42:48+00:00",
              "updatedAt": "2024-05-29T11:43:30+00:00",
              "pages": 10,
              "version": 3
          },
          "relationships": [
              {
                  "id": "4209a4a9-b838-4817-be40-0c8ef2f7be4a",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "a843a877-1f79-4d91-aac0-65e199c7ffc6",
                  "type": "user"
              }
          ]
      },
      {
          "id": "8e76537e-e290-492f-be95-e8c79c1da7d6",
          "type": "chapter",
          "attributes": {
              "volume": null,
              "chapter": "7.6",
              "title": null,
              "translatedLanguage": "en",
              "externalUrl": null,
              "publishAt": "2025-01-21T15:41:33+00:00",
              "readableAt": "2025-01-21T15:41:33+00:00",
              "createdAt": "2025-01-21T15:41:33+00:00",
              "updatedAt": "2025-01-21T15:42:03+00:00",
              "pages": 7,
              "version": 3
          },
          "relationships": [
              {
                  "id": "0f9d3a19-5675-4446-a56e-9e2e89ad3a4a",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "af6fd36e-c516-4b9c-ab8a-aec30b230236",
                  "type": "user"
              }
          ]
      },
      {
          "id": "bdf81a28-7580-448e-8acd-d68ea829a07c",
          "type": "chapter",
          "attributes": {
              "volume": null,
              "chapter": "7.7",
              "title": null,
              "translatedLanguage": "en",
              "externalUrl": null,
              "publishAt": "2025-01-22T07:12:39+00:00",
              "readableAt": "2025-01-22T07:12:39+00:00",
              "createdAt": "2025-01-22T07:12:38+00:00",
              "updatedAt": "2025-01-22T07:13:00+00:00",
              "pages": 6,
              "version": 3
          },
          "relationships": [
              {
                  "id": "0f9d3a19-5675-4446-a56e-9e2e89ad3a4a",
                  "type": "scanlation_group"
              },
              {
                  "id": "febd3e05-6300-4105-95cc-2c39c19ce876",
                  "type": "manga"
              },
              {
                  "id": "af6fd36e-c516-4b9c-ab8a-aec30b230236",
                  "type": "user"
              }
          ]
      }
  ],
  "limit": 499,
  "offset": 0,
  "total": 55
}