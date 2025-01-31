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
} from "@/once-ui/components";
import SpotlightCarousel from "@/components/home/spotlight-carousel";
import { NextPage } from "next";
import { getHianime } from "@/lib/hianime";
import LatestEpisodeScroller from "@/components/home/latest-episode-scroller";
import TrendingScroller from "@/components/home/trending-scroller";
import {
  MangaHistory,
  useHianimeStore,
  useHistoryStore,
  useMangadexStore,
} from "@/lib/store";
import { getLatestUpdate } from "@/lib/mangadex";
import UserIncludesManga from "@/components/manga/user-includes-manga";
import InlineHomeUpdate from "@/components/home/inline-home-update";
import HomeBackground from "@/components/home/home-background";
import Loading from "@/components/home/common/loading";
import { encrypt } from "@/lib/crypto";

const Home: NextPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { addToast } = useToast();
  const { mangaHistory, setMangaHistory } = useHistoryStore();
  const reverseProxy = process.env.NEXT_PUBLIC_REVERSE_PROXY ?? "";
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const mangaHistoryResponse = await fetch("/api/v1/manga-history");
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
        gap="32"
      >
        {loading || !mangaHistory ? (
          <Loading />
        ) : (
          <Fragment>
            <Column paddingLeft="8" hide="s">
              <Heading align="left" as="h2" variant="display-default-m">
                Manga History
              </Heading>
              <Text marginBottom="8" align="left" onBackground="neutral-weak">
                New episodes that are sure to get you excited
              </Text>
            </Column>
            <Column paddingLeft="8" show="s">
              <Heading align="left" as="h2" variant="display-default-xs">
                Manga History
              </Heading>
              <Text marginBottom="8" align="left" onBackground="neutral-weak">
                New episodes that are sure to get you excited
              </Text>
            </Column>
            {mangaHistory.map((history) => (
              <SmartLink
                key={history.chapterId}
                href={`/manga/read/${encrypt(
                  `${history.mangaId}(-|-)${history.chapterId}`
                )}`}
              >
                <Column fillHeight overflowX="hidden" maxWidth={12} hide="s">
                  <SmartImage
                    aspectRatio="2/3"
                    radius="l"
                    fillWidth
                    width={12}
                    title={history.title}
                    src={`${reverseProxy}${history.cover}`}
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
                <Column fillHeight overflowX="hidden" maxWidth={8} show="s">
                  <SmartImage
                    aspectRatio="2/3"
                    radius="l"
                    fillWidth
                    width={8}
                    title={history.title}
                    src={history.cover}
                  />
                  <Text
                    variant="code-default-s"
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
          </Fragment>
        )}
      </Column>
    </Column>
  );
};

export default Home;
