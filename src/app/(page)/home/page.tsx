"use client";

import React, { Fragment, useEffect, useState } from "react";
import {
  useToast,
  Column,
  Flex,
  Text,
  Row,
  Tag,
  Scroller,
} from "@/once-ui/components";
import SpotlightCarousel from "@/components/home/spotlight-carousel";
import { NextPage } from "next";
import { getHianime } from "@/lib/hianime";
import HomeAnimeScroller from "@/components/home/latest-episode-scroller";
import TrendingScroller from "@/components/home/trending-scroller";
import { useHianimeStore, useMangadexStore } from "@/lib/store";
import { getLatestUpdate } from "@/lib/mangadex";
import UserIncludesManga from "@/components/manga/user-includes-manga";
import InlineHomeUpdate from "@/components/home/inline-home-update";
import HomeBackground from "@/components/home/home-background";
import Loading from "@/components/home/common/loading";

const Home: NextPage = () => {
  const { hianime, setHianime } = useHianimeStore();
  const [loading, setLoading] = useState<boolean>(false);
  const { addToast } = useToast();
  const { latestUpdate, setLatestUpdate } = useMangadexStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!hianime) {
          const hianimeResponse = await getHianime();
          setHianime(hianimeResponse);
        }
        if (!latestUpdate) {
          const latestUpdateResponse = await getLatestUpdate();
          setLatestUpdate(latestUpdateResponse);
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
        alignItems="center"
        border="neutral-alpha-weak"
        fillWidth
        paddingBottom="8"
        gap="32"
      >
        {loading || !hianime ? (
          <Loading />
        ) : (
          <Fragment>
            <SpotlightCarousel params={hianime?.results.spotlights ?? []} />
            {/* <InlineHomeUpdate /> */}
            <Scroller>
              {hianime.results.genres.map((genre) => (
                <Tag variant="brand" marginLeft="8">
                  <Text>{genre}</Text>
                </Tag>
              ))}
            </Scroller>
            <HomeAnimeScroller
              params={hianime?.results.latestEpisode ?? []}
              subtitle="Freshly released episodes you can't miss!"
              title="Latest Episodes"
            />
            <HomeAnimeScroller
              params={hianime?.results.mostFavorite ?? []}
              subtitle="Fan-favorite anime that everyone is watching!"
              title="Most Popular"
              left={false}
            />
            <HomeAnimeScroller
              params={hianime?.results.recentlyAdded ?? []}
              subtitle="New anime just added—discover something fresh!"
              title="Recently Added"
            />
            <HomeAnimeScroller
              params={hianime?.results.topAiring ?? []}
              subtitle="Top trending anime airing right now!"
              left={false}
              title="Top Airing"
            />
            <HomeAnimeScroller
              params={hianime?.results.topTen.today ?? []}
              subtitle="Today's hottest anime—don't miss out!"
              title="Top 10 Today"
            />
            <HomeAnimeScroller
              params={hianime?.results.topUpcoming ?? []}
              subtitle="Upcoming hits you should be hyped for!"
              left={false}
              title="Top Upcoming"
            />
            <UserIncludesManga
              manga={latestUpdate}
              title="Latest Chapter"
              left={true}
              subtitle="The latest chapters to keep you updated and entertained"
            />
            {/* <TrendingScroller params={hianime?.results.trending ?? []} /> */}
          </Fragment>
        )}
      </Column>
    </Column>
  );
};

export default Home;
