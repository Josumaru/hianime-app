"use client";
import PopularTitles from "@/components/manga/popular-titles";
import { getLatestUpdate, getPopular } from "@/lib/mangadex";
import { useMangadexStore } from "@/lib/store";
import {
  Background,
  Column,
  Flex,
  LetterFx,
  Row,
  Spinner,
  Text,
  useToast,
} from "@/once-ui/components";
import { NextPage } from "next";
import { useEffect, useState } from "react";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const { popularManga, setPopularManga, latestUpdate, setLatestUpdate } =
    useMangadexStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!popularManga) {
          const popularMangaResponse = await getPopular();
          setPopularManga(popularMangaResponse);
        }
        if (!latestUpdate) {
          const latestUpdateResponse = await getLatestUpdate();
          setLatestUpdate(latestUpdateResponse);
        }
      } catch (error: any) {
        setError(error.message);
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
      <Background
        mask={{
          x: 0,
          y: 100,
        }}
        position="fixed"
        grid={{
          display: true,
          width: "0.25rem",
          color: "neutral-alpha-medium",
          height: "0.25rem",
        }}
      />
      <Background
        mask={{
          x: 100,
          y: 100,
          radius: 100,
        }}
        position="fixed"
        gradient={{
          display: true,
          tilt: -35,
          height: 50,
          width: 75,
          x: 100,
          y: 40,
          colorStart: "accent-solid-medium",
          colorEnd: "static-transparent",
        }}
      />
      <Background
        position="absolute"
        mask={{
          cursor: true,
        }}
        gradient={{
          colorEnd: "static-transparent",
          colorStart: "accent-solid-strong",
          display: true,
          height: 100,
          opacity: 100,
          tilt: 0,
          width: 150,
          x: 0,
          y: 0,
        }}
        dots={{
          color: "accent-on-background-medium",
          display: true,
          opacity: 100,
          size: "64",
        }}
        grid={{
          color: "neutral-alpha-medium",
          display: true,
          height: "var(--static-space-32)",
          opacity: 100,
          width: "var(--static-space-32)",
        }}
        lines={{
          display: false,
          opacity: 100,
          size: "24",
        }}
      />
      <Column
        overflow="hidden"
        as="main"
        maxWidth="l"
        position="relative"
        radius="xl"
        alignItems="center"
        border="neutral-alpha-weak"
        fillWidth
      >
        <Flex
          fillHeight
          fillWidth
          justifyContent={"center"}
          alignItems={"center"}
        >
          {loading ? (
            <Spinner />
          ) : (
            <Column fillWidth>
              <PopularTitles params={popularManga?.data ?? []} />
              {latestUpdate?.data.map((manga) => (
                <Text key={manga.id}>{manga.attributes.title.en}</Text>
              ))}
            </Column>
          )}
        </Flex>
      </Column>
    </Column>
  );
};

export default Page;
