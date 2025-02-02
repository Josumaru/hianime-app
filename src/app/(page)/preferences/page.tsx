"use client";

import React, { Fragment, useEffect, useState } from "react";
import {
  useToast,
  Column,
  Text,
  Heading,
  SmartLink,
  SmartImage,
  LetterFx,
  Scroller,
  Tag,
  StylePanel,
} from "@/once-ui/components";
import { NextPage } from "next";
import { useHistoryStore } from "@/lib/store";
import HomeBackground from "@/components/home/home-background";
import Loading from "@/components/home/common/loading";
import { encrypt } from "@/lib/crypto";

const Home: NextPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { addToast } = useToast();
  const { mangaHistory, setMangaHistory, animeHistory, setAnimeHistory } =
    useHistoryStore();
  const reverseProxy = process.env.NEXT_PUBLIC_REVERSE_PROXY ?? "";
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const mangaHistoryResponse = await fetch("/api/v1/manga-history");
        const animeHistoryResponse = await fetch("/api/v1/anime-history");
        if (animeHistory.length == 0) {
          const data = await animeHistoryResponse.json();
          if (data.history) {
            setAnimeHistory(data.history);
          }
        }
        if (mangaHistory.length == 0) {
          const data = await mangaHistoryResponse.json();
          if (data.history) {
            setMangaHistory(data.history);
          }
        }

        addToast({
          message: "Data loaded successfully",
          variant: "success",
        });
      } catch (error: any) {
        addToast({
          message: error.message,
          variant: "danger",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Column fillWidth paddingY="80" paddingX="s" alignItems="center" flex={1}>
      <HomeBackground />
      <Column
        overflow="hidden"
        as="main"
        maxWidth="l"
        position="relative"
        radius="xl"
        alignItems="start"
        border="neutral-alpha-weak"
        fillWidth
        paddingBottom="8"
      >
        {mangaHistory && (
          <Fragment>
            <Column paddingLeft="8" hide="s">
              <Heading align="left" as="h2" variant="display-default-m">
                Manga History
              </Heading>
              <Text marginBottom="8" align="left" onBackground="neutral-weak">
                Catch up on the latest chapters of your favorite manga.
              </Text>
            </Column>
            <Column paddingLeft="8" show="s">
              <Heading align="left" as="h2" variant="display-default-xs">
                Manga History
              </Heading>
              <Text marginBottom="8" align="left" onBackground="neutral-weak">
                Revisit the most thrilling moments from past chapters.
              </Text>
            </Column>

            <Scroller>
              {mangaHistory.map((history) => (
                <SmartLink
                  key={history.chapterId}
                  href={`/manga/read/${encrypt(
                    `${history.mangaId}(-|-)${history.chapterId}`
                  )}`}
                >
                  <Column
                    fillHeight
                    overflowX="hidden"
                    maxWidth={12}
                    hide="s"
                    position="relative"
                  >
                    <SmartImage
                      aspectRatio="2/3"
                      radius="l"
                      fillWidth
                      width={12}
                      title={history.title}
                      src={`${reverseProxy}${history.cover}`}
                    />
                    <Tag
                      label={`Ch. ${history.chapter}`}
                      variant="brand"
                      margin="8"
                      position="absolute"
                      top="0"
                      opacity={70}
                    />
                    <Text
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        lineClamp: 1,
                        maxLines: 1,
                        maxWidth: "100%",
                      }}
                      wrap="nowrap"
                    >
                      <LetterFx
                        speed="medium"
                        trigger="instant"
                        charset={[
                          "X",
                          "@",
                          "$",
                          "a",
                          "H",
                          "z",
                          "o",
                          "0",
                          "y",
                          "#",
                          "?",
                          "*",
                          "0",
                          "1",
                          "+",
                        ]}
                      >
                        {history.mangaTitle}
                      </LetterFx>
                    </Text>
                  </Column>
                  <Column
                    fillHeight
                    overflowX="hidden"
                    maxWidth={8}
                    show="s"
                    position="relative"
                  >
                    <SmartImage
                      aspectRatio="2/3"
                      radius="l"
                      fillWidth
                      width={8}
                      title={history.title}
                      src={history.cover}
                    />
                    <Tag
                      label={`Ch. ${history.chapter}`}
                      variant="brand"
                      margin="8"
                      position="absolute"
                      top="0"
                      opacity={70}
                    />

                    <Text
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        lineClamp: 1,
                        maxLines: 1,
                        maxWidth: "100%",
                      }}
                      wrap="nowrap"
                    >
                      <LetterFx
                        speed="medium"
                        trigger="instant"
                        charset={[
                          "X",
                          "@",
                          "$",
                          "a",
                          "H",
                          "z",
                          "o",
                          "0",
                          "y",
                          "#",
                          "?",
                          "*",
                          "0",
                          "1",
                          "+",
                        ]}
                      >
                        {history.mangaTitle}
                      </LetterFx>
                    </Text>
                  </Column>
                </SmartLink>
              ))}
            </Scroller>
          </Fragment>
        )}
        {animeHistory && (
          <Fragment>
            <Column paddingLeft="8" hide="s" marginTop="24">
              <Heading align="left" as="h2" variant="display-default-m">
                Anime History
              </Heading>
              <Text marginBottom="8" align="left" onBackground="neutral-weak">
                Catch up on the latest episodes of your favorite anime.
              </Text>
            </Column>
            <Column paddingLeft="8" show="s" marginTop="24">
              <Heading align="left" as="h2" variant="display-default-xs">
                Anime History
              </Heading>
              <Text marginBottom="8" align="left" onBackground="neutral-weak">
                Relive the most exciting moments from past episodes.
              </Text>
            </Column>

            <Scroller>
              {animeHistory.map((history) => (
                <SmartLink
                  key={history.episodeId}
                  href={`/anime/watch/${encrypt(
                    `${history.animeId}(-|-)${history.episodeId}`
                  )}`}
                >
                  <Column
                    fillHeight
                    overflowX="hidden"
                    maxWidth={12}
                    hide="s"
                    position="relative"
                  >
                    <SmartImage
                      aspectRatio="2/3"
                      radius="l"
                      fillWidth
                      width={12}
                      title={history.title}
                      src={`${reverseProxy}${history.cover}`}
                    />
                    <Tag
                      label={`Ep. ${history.episode}`}
                      variant="brand"
                      margin="8"
                      position="absolute"
                      top="0"
                      opacity={70}
                    />

                    <Text
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        lineClamp: 1,
                        maxLines: 1,
                        maxWidth: "100%",
                      }}
                      wrap="nowrap"
                    >
                      <LetterFx
                        speed="medium"
                        trigger="instant"
                        charset={[
                          "X",
                          "@",
                          "$",
                          "a",
                          "H",
                          "z",
                          "o",
                          "0",
                          "y",
                          "#",
                          "?",
                          "*",
                          "0",
                          "1",
                          "+",
                        ]}
                      >
                        {history.animeTitle}
                      </LetterFx>
                    </Text>
                  </Column>
                  <Column
                    fillHeight
                    overflowX="hidden"
                    maxWidth={8}
                    show="s"
                    position="relative"
                  >
                    <SmartImage
                      aspectRatio="2/3"
                      radius="l"
                      fillWidth
                      width={8}
                      title={history.title}
                      src={history.cover}
                    />
                    <Tag
                      label={`Ep. ${history.episode}`}
                      variant="brand"
                      margin="8"
                      position="absolute"
                      top="0"
                      opacity={70}
                    />
                    <Text
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        lineClamp: 1,
                        maxLines: 1,
                        maxWidth: "100%",
                      }}
                      wrap="nowrap"
                    >
                      <LetterFx
                        speed="medium"
                        trigger="instant"
                        charset={[
                          "X",
                          "@",
                          "$",
                          "a",
                          "H",
                          "z",
                          "o",
                          "0",
                          "y",
                          "#",
                          "?",
                          "*",
                          "0",
                          "1",
                          "+",
                        ]}
                      >
                        {history.animeTitle}
                      </LetterFx>
                    </Text>
                  </Column>
                </SmartLink>
              ))}
            </Scroller>
          </Fragment>
        )}
        {loading ? (
          <Loading />
        ) : (
          <Fragment>
            <Column marginTop="24">
              <Column paddingLeft="8" hide="s">
                <Heading align="left" as="h2" variant="display-default-m">
                  Theme Preferences
                </Heading>
                <Text marginBottom="8" align="left" onBackground="neutral-weak">
                  Customize your experience by selecting your preferred theme.
                </Text>
              </Column>
              <Column paddingLeft="8" show="s">
                <Heading align="left" as="h2" variant="display-default-xs">
                  Theme Preferences
                </Heading>
                <Text marginBottom="8" align="left" onBackground="neutral-weak">
                  Customize your experience by selecting your preferred theme.
                </Text>
              </Column>
              <StylePanel />
            </Column>
          </Fragment>
        )}
      </Column>
    </Column>
  );
};

export default Home;
