"use client";
import LatestEpisodeScroller from "@/components/home/latest-episode-scroller";
import PopularTitles from "@/components/manga/popular-titles";
import { encrypt } from "@/lib/crypto";
import { getLatestUpdate, getPopular } from "@/lib/mangadex";
import { useMangadexStore } from "@/lib/store";
import {
  Background,
  Column,
  Flex,
  Grid,
  Heading,
  LetterFx,
  Row,
  SmartImage,
  SmartLink,
  Spinner,
  Tag,
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
  const reverseProxy = process.env.NEXT_PUBLIC_REVERSE_PROXY
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
                <Heading
                  as="h2"
                  marginTop="l"
                  variant="display-default-m"
                  align="right"
                >
                  Latest Chapter
                </Heading>
                <Text
                  align="right"
                  onBackground="neutral-weak"
                >
                  The latest chapters to keep you updated and entertained
                </Text>
                <Grid gap="4" columns={4} mobileColumns={1} tabletColumns={3}>
                  {latestUpdate?.data.map((manga) => (
                    <Row
                      key={manga.id}
                      background="brand-medium"
                      border="brand-medium"
                      radius="m"
                      paddingY="8"
                      opacity={70}
                    >
                      <SmartLink href={`/manga/detail/${encrypt(manga.id)}`}>
                        <SmartImage
                          aspectRatio="9/16"
                          radius="s"
                          width={"128"}
                          src={`${reverseProxy}https://uploads.mangadex.org/covers/${
                            manga.id
                          }/${
                            manga.relationships.find(
                              (relationship) =>
                                relationship.type === "cover_art"
                            )?.attributes?.fileName
                          }.256.jpg`}
                        />
                        <Column gap="xs" fillWidth>
                          <Text
                            style={{
                              display: "-webkit-box",
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              WebkitLineClamp: 1,
                            }}
                          >
                            {manga.attributes.title.en}
                          </Text>
                          <Tag
                            label={manga.attributes.tags[0].attributes.name.en}
                            variant="danger"
                          />
                          <Row gap="xs">
                            {manga.relationships.find(
                              (relationship) =>
                                relationship.type === "cover_art"
                            )?.attributes?.volume && (
                              <Text variant="label-default-l">
                                Vol.{" "}
                                {
                                  manga.relationships.find(
                                    (relationship) =>
                                      relationship.type === "cover_art"
                                  )?.attributes?.volume
                                }
                              </Text>
                            )}
                            {manga.attributes.lastVolume && (
                              <Text variant="label-default-l">
                                Vol. {manga.attributes.lastVolume}
                              </Text>
                            )}
                          </Row>
                        </Column>
                      </SmartLink>
                    </Row>
                  ))}
                </Grid>
                <Heading as="h2" variant="display-default-m" align="left">
                  Latest Chapter
                </Heading>
                <Text
                  align="left"
                  marginBottom="32"
                  onBackground="neutral-weak"
                >
                  The latest chapters to keep you updated and entertained
                </Text>
              </Column>
            </Column>
          )}
        </Flex>
      </Column>
    </Column>
  );
};

export default Page;
