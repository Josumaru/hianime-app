"use client";
import CategoryScroller from "@/components/anime/category-scroller";
import Loading from "@/components/home/common/loading";
import HomeBackground from "@/components/home/home-background";
import { getCategory } from "@/lib/hianime";
import { useHianimeStore } from "@/lib/store";
import { Column, Flex, LetterFx, Text, useToast } from "@/once-ui/components";
import { NextPage } from "next";
import { useEffect, useState } from "react";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const {
    tv,
    setTv,
    movie,
    setMovie,
    upcoming,
    setUpcoming,
    topAiring,
    setTopAiring,
    completed,
    setCompleted,
  } = useHianimeStore();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const topAiring = await getCategory("top-airing");
        setTopAiring(topAiring);
        const upcoming = await getCategory("top-upcoming");
        setUpcoming(upcoming);
        const tv = await getCategory("tv");
        setTv(tv);
        const movie = await getCategory("movie");
        setMovie(movie);
        const completed = await getCategory("completed");
        setCompleted(completed);
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
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <Flex
      fillWidth
      paddingY="80"
      paddingX="s"
      alignItems="center"
      flex={1}
      justifyContent="center"
    >
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
        <HomeBackground />
        {isLoading ? (
          <Loading />
        ) : (
          <Column fillWidth fillHeight>
            {topAiring && (
              <CategoryScroller
                anime={topAiring}
                title="Top Airing Anime"
                subtitle="Don't miss the hottest shows airing now!"
              />
            )}
            {upcoming && (
              <CategoryScroller
                anime={upcoming}
                left={false}
                title="Upcoming Hits"
                subtitle="Be the first to catch these highly anticipated releases!"
              />
            )}
            {tv && (
              <CategoryScroller
                anime={tv}
                title="Must-Watch TV Shows"
                subtitle="Dive into epic stories and unforgettable moments."
              />
            )}
            {movie && (
              <CategoryScroller
                left={false}
                anime={movie}
                title="Blockbuster Movies"
                subtitle="Discover anime movies that will blow your mind!"
              />
            )}
            {completed && (
              <CategoryScroller
                anime={completed}
                title="Completed Anime"
                subtitle="Relive epic adventures with stories that are complete and satisfying!"
              />
            )}
          </Column>
        )}
      </Column>
    </Flex>
  );
};

export default Page;
