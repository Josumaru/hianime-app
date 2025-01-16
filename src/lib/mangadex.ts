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
    const chapterEndpoint = `${baseUrl}/chapter?includes[]=scanlation_group&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&order[readableAt]=desc&limit=64`;

    const chapterResponse = await axios.get<MangadexChapter>(chapterEndpoint);
    // const ids = chapterResponse.data.data.flatMap((data) =>
      const ids = chapterData.data.flatMap((data) =>
      data.relationships
        .map((rel) => rel.id)
    );
    const mangaEndpoint = `${baseUrl}/manga?${ids
      .map((id) => `ids[]=${id}`)
      .join(
        "&"
      )}&limit=100&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic&includes[]=cover_art`;
    console.log(mangaEndpoint);

    const mangaResponse = await axios.get<MangadexManga>(mangaEndpoint);
    return mangaResponse.data;
  } catch (error: any) {
    console.log(error.message);
    throw new Error(`Oh hell! Something went wrong (◡︵◡)`);
  }
};

const chapterData = {
  result: "ok",
  response: "collection",
  data: [
    {
      id: "0aaf8b27-0013-4ae0-8935-91a089466874",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "1",
        title: "",
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2018-01-15T16:38:24+00:00",
        readableAt: "2018-01-15T16:38:24+00:00",
        createdAt: "2018-01-15T16:38:24+00:00",
        updatedAt: "2024-12-30T13:12:39+00:00",
        pages: 15,
        version: 3,
      },
      relationships: [
        {
          id: "caf0d1da-a790-49d0-833c-ce74d651c8a1",
          type: "scanlation_group",
          attributes: {
            name: "Doki Fansubs",
            altNames: [
              {
                en: "Doki",
              },
              {
                en: "Doki Scans",
              },
            ],
            locked: true,
            website: "https://doki.co/",
            ircServer: "irc.rizon.net",
            ircChannel: "doki",
            discord: "Y2YKXUP",
            contactEmail: "holo@doki.co",
            description:
              "**An anime fansub group which also does manga occasionally.** *Saving anime/manga since 2009!* ",
            twitter: null,
            mangaUpdates:
              "https://www.mangaupdates.com/group/owzmmam/doki-fansubs",
            focusedLanguages: ["en"],
            official: false,
            verified: false,
            inactive: false,
            publishDelay: null,
            createdAt: "2021-04-19T21:45:59+00:00",
            updatedAt: "2023-02-13T18:14:23+00:00",
            version: 2,
          },
        },
        {
          id: "127820bd-8fc5-47b8-8782-e680317bf41d",
          type: "manga",
        },
        {
          id: "16cf9cc6-78a4-4037-abdc-abf9145d74c8",
          type: "user",
        },
      ],
    },
    {
      id: "bbf176a0-ea53-4b8b-8e23-8aa192e838d5",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "2",
        title: "",
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2018-01-15T16:38:57+00:00",
        readableAt: "2018-01-15T16:38:57+00:00",
        createdAt: "2018-01-15T16:38:57+00:00",
        updatedAt: "2018-01-15T16:38:57+00:00",
        pages: 14,
        version: 1,
      },
      relationships: [
        {
          id: "caf0d1da-a790-49d0-833c-ce74d651c8a1",
          type: "scanlation_group",
          attributes: {
            name: "Doki Fansubs",
            altNames: [
              {
                en: "Doki",
              },
              {
                en: "Doki Scans",
              },
            ],
            locked: true,
            website: "https://doki.co/",
            ircServer: "irc.rizon.net",
            ircChannel: "doki",
            discord: "Y2YKXUP",
            contactEmail: "holo@doki.co",
            description:
              "**An anime fansub group which also does manga occasionally.** *Saving anime/manga since 2009!* ",
            twitter: null,
            mangaUpdates:
              "https://www.mangaupdates.com/group/owzmmam/doki-fansubs",
            focusedLanguages: ["en"],
            official: false,
            verified: false,
            inactive: false,
            publishDelay: null,
            createdAt: "2021-04-19T21:45:59+00:00",
            updatedAt: "2023-02-13T18:14:23+00:00",
            version: 2,
          },
        },
        {
          id: "127820bd-8fc5-47b8-8782-e680317bf41d",
          type: "manga",
        },
        {
          id: "16cf9cc6-78a4-4037-abdc-abf9145d74c8",
          type: "user",
        },
      ],
    },
    {
      id: "aff0e720-88f2-45c5-8d9e-817f84d4c306",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "3",
        title: "",
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2018-01-15T16:39:53+00:00",
        readableAt: "2018-01-15T16:39:53+00:00",
        createdAt: "2018-01-15T16:39:53+00:00",
        updatedAt: "2018-01-15T16:39:53+00:00",
        pages: 12,
        version: 1,
      },
      relationships: [
        {
          id: "caf0d1da-a790-49d0-833c-ce74d651c8a1",
          type: "scanlation_group",
          attributes: {
            name: "Doki Fansubs",
            altNames: [
              {
                en: "Doki",
              },
              {
                en: "Doki Scans",
              },
            ],
            locked: true,
            website: "https://doki.co/",
            ircServer: "irc.rizon.net",
            ircChannel: "doki",
            discord: "Y2YKXUP",
            contactEmail: "holo@doki.co",
            description:
              "**An anime fansub group which also does manga occasionally.** *Saving anime/manga since 2009!* ",
            twitter: null,
            mangaUpdates:
              "https://www.mangaupdates.com/group/owzmmam/doki-fansubs",
            focusedLanguages: ["en"],
            official: false,
            verified: false,
            inactive: false,
            publishDelay: null,
            createdAt: "2021-04-19T21:45:59+00:00",
            updatedAt: "2023-02-13T18:14:23+00:00",
            version: 2,
          },
        },
        {
          id: "127820bd-8fc5-47b8-8782-e680317bf41d",
          type: "manga",
        },
        {
          id: "16cf9cc6-78a4-4037-abdc-abf9145d74c8",
          type: "user",
        },
      ],
    },
    {
      id: "dfc5a5cc-8b36-4f0c-a272-ae69802c91f8",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "4",
        title: "",
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2018-01-15T16:41:00+00:00",
        readableAt: "2018-01-15T16:41:00+00:00",
        createdAt: "2018-01-15T16:41:00+00:00",
        updatedAt: "2018-01-15T16:41:00+00:00",
        pages: 14,
        version: 1,
      },
      relationships: [
        {
          id: "caf0d1da-a790-49d0-833c-ce74d651c8a1",
          type: "scanlation_group",
          attributes: {
            name: "Doki Fansubs",
            altNames: [
              {
                en: "Doki",
              },
              {
                en: "Doki Scans",
              },
            ],
            locked: true,
            website: "https://doki.co/",
            ircServer: "irc.rizon.net",
            ircChannel: "doki",
            discord: "Y2YKXUP",
            contactEmail: "holo@doki.co",
            description:
              "**An anime fansub group which also does manga occasionally.** *Saving anime/manga since 2009!* ",
            twitter: null,
            mangaUpdates:
              "https://www.mangaupdates.com/group/owzmmam/doki-fansubs",
            focusedLanguages: ["en"],
            official: false,
            verified: false,
            inactive: false,
            publishDelay: null,
            createdAt: "2021-04-19T21:45:59+00:00",
            updatedAt: "2023-02-13T18:14:23+00:00",
            version: 2,
          },
        },
        {
          id: "127820bd-8fc5-47b8-8782-e680317bf41d",
          type: "manga",
        },
        {
          id: "16cf9cc6-78a4-4037-abdc-abf9145d74c8",
          type: "user",
        },
      ],
    },
    {
      id: "68b3cde2-0acd-4e4b-9842-780c301852c1",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "5",
        title: "",
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2018-01-15T16:41:28+00:00",
        readableAt: "2018-01-15T16:41:28+00:00",
        createdAt: "2018-01-15T16:41:28+00:00",
        updatedAt: "2018-01-15T16:41:28+00:00",
        pages: 12,
        version: 1,
      },
      relationships: [
        {
          id: "caf0d1da-a790-49d0-833c-ce74d651c8a1",
          type: "scanlation_group",
          attributes: {
            name: "Doki Fansubs",
            altNames: [
              {
                en: "Doki",
              },
              {
                en: "Doki Scans",
              },
            ],
            locked: true,
            website: "https://doki.co/",
            ircServer: "irc.rizon.net",
            ircChannel: "doki",
            discord: "Y2YKXUP",
            contactEmail: "holo@doki.co",
            description:
              "**An anime fansub group which also does manga occasionally.** *Saving anime/manga since 2009!* ",
            twitter: null,
            mangaUpdates:
              "https://www.mangaupdates.com/group/owzmmam/doki-fansubs",
            focusedLanguages: ["en"],
            official: false,
            verified: false,
            inactive: false,
            publishDelay: null,
            createdAt: "2021-04-19T21:45:59+00:00",
            updatedAt: "2023-02-13T18:14:23+00:00",
            version: 2,
          },
        },
        {
          id: "127820bd-8fc5-47b8-8782-e680317bf41d",
          type: "manga",
        },
        {
          id: "16cf9cc6-78a4-4037-abdc-abf9145d74c8",
          type: "user",
        },
      ],
    },
    {
      id: "da9e3b05-c2b6-430d-b97f-0c825098a22c",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "6",
        title: "",
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2018-01-15T16:42:30+00:00",
        readableAt: "2018-01-15T16:42:30+00:00",
        createdAt: "2018-01-15T16:42:30+00:00",
        updatedAt: "2018-01-15T16:42:30+00:00",
        pages: 14,
        version: 1,
      },
      relationships: [
        {
          id: "caf0d1da-a790-49d0-833c-ce74d651c8a1",
          type: "scanlation_group",
          attributes: {
            name: "Doki Fansubs",
            altNames: [
              {
                en: "Doki",
              },
              {
                en: "Doki Scans",
              },
            ],
            locked: true,
            website: "https://doki.co/",
            ircServer: "irc.rizon.net",
            ircChannel: "doki",
            discord: "Y2YKXUP",
            contactEmail: "holo@doki.co",
            description:
              "**An anime fansub group which also does manga occasionally.** *Saving anime/manga since 2009!* ",
            twitter: null,
            mangaUpdates:
              "https://www.mangaupdates.com/group/owzmmam/doki-fansubs",
            focusedLanguages: ["en"],
            official: false,
            verified: false,
            inactive: false,
            publishDelay: null,
            createdAt: "2021-04-19T21:45:59+00:00",
            updatedAt: "2023-02-13T18:14:23+00:00",
            version: 2,
          },
        },
        {
          id: "127820bd-8fc5-47b8-8782-e680317bf41d",
          type: "manga",
        },
        {
          id: "16cf9cc6-78a4-4037-abdc-abf9145d74c8",
          type: "user",
        },
      ],
    },
    {
      id: "a321ba6c-f723-434f-8119-5b898e86980a",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "6.5",
        title: "",
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2018-01-15T16:43:25+00:00",
        readableAt: "2018-01-15T16:43:25+00:00",
        createdAt: "2018-01-15T16:43:25+00:00",
        updatedAt: "2018-01-15T16:43:25+00:00",
        pages: 12,
        version: 1,
      },
      relationships: [
        {
          id: "caf0d1da-a790-49d0-833c-ce74d651c8a1",
          type: "scanlation_group",
          attributes: {
            name: "Doki Fansubs",
            altNames: [
              {
                en: "Doki",
              },
              {
                en: "Doki Scans",
              },
            ],
            locked: true,
            website: "https://doki.co/",
            ircServer: "irc.rizon.net",
            ircChannel: "doki",
            discord: "Y2YKXUP",
            contactEmail: "holo@doki.co",
            description:
              "**An anime fansub group which also does manga occasionally.** *Saving anime/manga since 2009!* ",
            twitter: null,
            mangaUpdates:
              "https://www.mangaupdates.com/group/owzmmam/doki-fansubs",
            focusedLanguages: ["en"],
            official: false,
            verified: false,
            inactive: false,
            publishDelay: null,
            createdAt: "2021-04-19T21:45:59+00:00",
            updatedAt: "2023-02-13T18:14:23+00:00",
            version: 2,
          },
        },
        {
          id: "127820bd-8fc5-47b8-8782-e680317bf41d",
          type: "manga",
        },
        {
          id: "16cf9cc6-78a4-4037-abdc-abf9145d74c8",
          type: "user",
        },
      ],
    },
    {
      id: "96ce3263-6e8d-42c7-8c70-9871cc7365d4",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "7",
        title: "",
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2018-01-15T16:44:35+00:00",
        readableAt: "2018-01-15T16:44:35+00:00",
        createdAt: "2018-01-15T16:44:35+00:00",
        updatedAt: "2018-01-15T16:44:35+00:00",
        pages: 14,
        version: 1,
      },
      relationships: [
        {
          id: "caf0d1da-a790-49d0-833c-ce74d651c8a1",
          type: "scanlation_group",
          attributes: {
            name: "Doki Fansubs",
            altNames: [
              {
                en: "Doki",
              },
              {
                en: "Doki Scans",
              },
            ],
            locked: true,
            website: "https://doki.co/",
            ircServer: "irc.rizon.net",
            ircChannel: "doki",
            discord: "Y2YKXUP",
            contactEmail: "holo@doki.co",
            description:
              "**An anime fansub group which also does manga occasionally.** *Saving anime/manga since 2009!* ",
            twitter: null,
            mangaUpdates:
              "https://www.mangaupdates.com/group/owzmmam/doki-fansubs",
            focusedLanguages: ["en"],
            official: false,
            verified: false,
            inactive: false,
            publishDelay: null,
            createdAt: "2021-04-19T21:45:59+00:00",
            updatedAt: "2023-02-13T18:14:23+00:00",
            version: 2,
          },
        },
        {
          id: "127820bd-8fc5-47b8-8782-e680317bf41d",
          type: "manga",
        },
        {
          id: "16cf9cc6-78a4-4037-abdc-abf9145d74c8",
          type: "user",
        },
      ],
    },
    {
      id: "317f6c2f-095d-4de4-aee1-111224db8f22",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "8",
        title: "",
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2018-01-15T16:46:12+00:00",
        readableAt: "2018-01-15T16:46:12+00:00",
        createdAt: "2018-01-15T16:46:12+00:00",
        updatedAt: "2018-01-15T16:46:12+00:00",
        pages: 12,
        version: 1,
      },
      relationships: [
        {
          id: "caf0d1da-a790-49d0-833c-ce74d651c8a1",
          type: "scanlation_group",
          attributes: {
            name: "Doki Fansubs",
            altNames: [
              {
                en: "Doki",
              },
              {
                en: "Doki Scans",
              },
            ],
            locked: true,
            website: "https://doki.co/",
            ircServer: "irc.rizon.net",
            ircChannel: "doki",
            discord: "Y2YKXUP",
            contactEmail: "holo@doki.co",
            description:
              "**An anime fansub group which also does manga occasionally.** *Saving anime/manga since 2009!* ",
            twitter: null,
            mangaUpdates:
              "https://www.mangaupdates.com/group/owzmmam/doki-fansubs",
            focusedLanguages: ["en"],
            official: false,
            verified: false,
            inactive: false,
            publishDelay: null,
            createdAt: "2021-04-19T21:45:59+00:00",
            updatedAt: "2023-02-13T18:14:23+00:00",
            version: 2,
          },
        },
        {
          id: "127820bd-8fc5-47b8-8782-e680317bf41d",
          type: "manga",
        },
        {
          id: "16cf9cc6-78a4-4037-abdc-abf9145d74c8",
          type: "user",
        },
      ],
    },
    {
      id: "7c03d00c-55f5-4370-bb00-8bc3dafee36c",
      type: "chapter",
      attributes: {
        volume: "1",
        chapter: "9",
        title: "",
        translatedLanguage: "en",
        externalUrl: null,
        publishAt: "2018-01-15T16:46:56+00:00",
        readableAt: "2018-01-15T16:46:56+00:00",
        createdAt: "2018-01-15T16:46:56+00:00",
        updatedAt: "2018-01-15T16:46:56+00:00",
        pages: 14,
        version: 1,
      },
      relationships: [
        {
          id: "caf0d1da-a790-49d0-833c-ce74d651c8a1",
          type: "scanlation_group",
          attributes: {
            name: "Doki Fansubs",
            altNames: [
              {
                en: "Doki",
              },
              {
                en: "Doki Scans",
              },
            ],
            locked: true,
            website: "https://doki.co/",
            ircServer: "irc.rizon.net",
            ircChannel: "doki",
            discord: "Y2YKXUP",
            contactEmail: "holo@doki.co",
            description:
              "**An anime fansub group which also does manga occasionally.** *Saving anime/manga since 2009!* ",
            twitter: null,
            mangaUpdates:
              "https://www.mangaupdates.com/group/owzmmam/doki-fansubs",
            focusedLanguages: ["en"],
            official: false,
            verified: false,
            inactive: false,
            publishDelay: null,
            createdAt: "2021-04-19T21:45:59+00:00",
            updatedAt: "2023-02-13T18:14:23+00:00",
            version: 2,
          },
        },
        {
          id: "127820bd-8fc5-47b8-8782-e680317bf41d",
          type: "manga",
        },
        {
          id: "16cf9cc6-78a4-4037-abdc-abf9145d74c8",
          type: "user",
        },
      ],
    },
  ],
  limit: 10,
  offset: 0,
  total: 2293724,
};
