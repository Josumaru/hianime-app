"use client";
import LatestChapter from "@/components/manga/latest-chapter";
import PopularTitles from "@/components/manga/popular-titles";
import UserIncludesManga from "@/components/manga/user-includes-manga";
import {
  getLatestUpdate,
  getMangadexRecentlyAdded,
  getMangadexUserInlcludes,
  getPopular,
} from "@/lib/mangadex";
import { useMangadexStore } from "@/lib/store";
import {
  Background,
  Column,
  Flex,
  Spinner,
  useToast,
} from "@/once-ui/components";
import { NextPage } from "next";
import { useEffect, useState } from "react";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const {
    popularManga,
    setPopularManga,
    latestUpdate,
    setLatestUpdate,
    selfPublished,
    setSelfPublished,
    staffPicks,
    setStaffPicks,
    seasonal,
    setSeasonal,
    featuredBySupporters,
    setFeaturedBySupporters,
    recentlyAdded,
    setRecentlyAdded,
  } = useMangadexStore();
  const [loading, setLoading] = useState<boolean>(true);
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
        if (!selfPublished) {
          const selfPublishedResponse = await getMangadexUserInlcludes(
            "f66ebc10-ef89-46d1-be96-bb704559e04a"
          );
          setSelfPublished(selfPublishedResponse);
        }
        if (!staffPicks) {
          const staffPicksResponse = await getMangadexUserInlcludes(
            "805ba886-dd99-4aa4-b460-4bd7c7b71352"
          );
          setStaffPicks(staffPicksResponse);
        }
        if (!featuredBySupporters) {
          const featuredBySupportersResponse = await getMangadexUserInlcludes(
            "5c5e6e39-0b4b-413e-be59-27b1ba03d1b9"
          );
          setFeaturedBySupporters(featuredBySupportersResponse);
        }
        if (!seasonal) {
          const seasonalResponse = await getMangadexUserInlcludes(
            "a5ba5473-07b2-4d0a-aefd-90d9d4a04521"
          );
          setSeasonal(seasonalResponse);
        }
        if (!latestUpdate) {
          const latestUpdateResponse = await getLatestUpdate();
          setLatestUpdate(latestUpdateResponse);
        }
        if (!recentlyAdded) {
          const recentlyAddedResponse = await getMangadexRecentlyAdded();
          setRecentlyAdded(recentlyAddedResponse);
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
        position="fixed"
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
        fillHeight
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
              <Column padding="s">
                <LatestChapter />
                <UserIncludesManga
                  manga={selfPublished}
                  left
                  title="Self Published"
                  subtitle="The latest chapters to keep you updated and entertained"
                />
                <UserIncludesManga
                  manga={staffPicks}
                  title="Staff Picks"
                  subtitle="The latest chapters to keep you updated and entertained"
                />
                <UserIncludesManga
                  manga={featuredBySupporters}
                  left
                  title="Featured by Supporters"
                  subtitle="The latest chapters to keep you updated and entertained"
                />
                <UserIncludesManga
                  manga={seasonal}
                  title="Seasonal"
                  subtitle="The latest chapters to keep you updated and entertained"
                />
                <UserIncludesManga
                  manga={recentlyAdded}
                  left
                  title="Recently Added"
                  subtitle="The latest chapters to keep you updated and entertained"
                />
              </Column>
            </Column>
          )}
        </Flex>
      </Column>
    </Column>
  );
};

export default Page;
