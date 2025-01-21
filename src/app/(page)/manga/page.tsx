"use client";
import Loading from "@/components/home/common/loading";
import LatestChapter from "@/components/manga/latest-chapter";
import MangaBackground from "@/components/manga/manga-background";
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
import { Fragment, useEffect, useState } from "react";

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
            "5c5e6e39-0b4b-413e-be59-27b1ba03d1b9"
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
  const mangaSections = [
    {
      manga: latestUpdate,
      left: true,
      title: "Latest Chapter",
      subtitle: "The latest chapters to keep you updated and entertained",
    },
    {
      manga: selfPublished,
      left: true,
      title: "Self Published",
      subtitle: "The latest chapters to keep you updated and entertained",
    },
    {
      manga: staffPicks,
      title: "Staff Picks",
      subtitle: "The latest chapters to keep you updated and entertained",
    },
    {
      manga: featuredBySupporters,
      left: true,
      title: "Featured by Supporters",
      subtitle: "The latest chapters to keep you updated and entertained",
    },
    {
      manga: seasonal,
      title: "Seasonal",
      subtitle: "The latest chapters to keep you updated and entertained",
    },
    {
      manga: recentlyAdded,
      left: true,
      title: "Recently Added",
      subtitle: "The latest chapters to keep you updated and entertained",
    },
  ];

  return (
    <Column fillWidth paddingY="80" paddingX="s" alignItems="center" flex={1}>
      <MangaBackground />
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
        {loading ? (
          <Loading />
        ) : (
          <Fragment>
            <PopularTitles params={popularManga?.data ?? []} />
            {mangaSections.map((section, index) => (
              <UserIncludesManga
                key={index}
                manga={section.manga}
                left={section.left}
                title={section.title}
                subtitle={section.subtitle}
              />
            ))}
          </Fragment>
        )}
      </Column>
    </Column>
  );
};

export default Page;
