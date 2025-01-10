"use client";
import { getEpisodes, getInfo } from "@/lib/hianime";
import {
  Avatar,
  Background,
  Badge,
  Button,
  Column,
  Flex,
  GlitchFx,
  Grid,
  LetterFx,
  RevealFx,
  Row,
  SmartImage,
  SmartLink,
  Spinner,
  Text,
  User,
  useToast,
} from "@/once-ui/components";
import { Episodes } from "@/types/episodes";
import { Info } from "@/types/info";
import { NextPage } from "next";
import { use, useEffect, useState } from "react";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

const Page: NextPage<Props> = ({ params }) => {
  const { id } = use(params);
  const [info, setInfo] = useState<Info | null>(null);
  const [episodes, setEpisodes] = useState<Episodes | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const infoResponse = await getInfo(id);
        const episodeResponse = await getEpisodes(id);
        if (episodeResponse.results.episodes) {
          setEpisodes(episodeResponse);
        } else {
          throw new Error(
            "Oooh no..., Your anime episodes is not available (ㅠ﹏ㅠ)"
          );
        }
        if (infoResponse.results.data) {
          setInfo(infoResponse);
          addToast({
            message: `Yeay..., ${infoResponse?.results.data.title} online (,,>ヮ<,,)!`,
            variant: "success",
          });
        } else {
          throw new Error("Oooh no..., Your anime not available (っ◞‸◟ c)");
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
  return error ? (
    <Text
      style={{
        fontFamily: "var(--font-family-code)",
        maxLines: 1,
        lineClamp: 1,
      }}
    >
      <LetterFx speed="medium" trigger="instant">
        {error}
      </LetterFx>
    </Text>
  ) : loading ? (
    <Flex fillWidth fillHeight justifyContent="center" alignItems="center">
      <Spinner size="xl" />
    </Flex>
  ) : (
    <Column fillWidth paddingY="80" paddingX="s" alignItems="center" flex={1}>
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
      <Flex
        gap="128"
        as="main"
        maxWidth="l"
        position="relative"
        alignItems="center"
        fillWidth
      >
        <Column gap="12" border="neutral-alpha-weak" radius="xl" padding="12">
          <Row gap="12">
            <GlitchFx speed="medium">
              <Avatar
                size="xl"
                src={
                  info?.results.data.poster ?? `https://avatar.vercel.sh/${id}`
                }
                loading={info?.results.data.poster == undefined}
              />
            </GlitchFx>
            <Column>
              <RevealFx
                speed="medium"
                delay={0}
                translateY={0}
                onBackground="brand-medium"
                justifyContent="start"
              >
                <Text variant="body-strong-xl">
                  {info?.results.data.japanese_title}
                  <Text as="span" variant="label-default-xl">
                    {" "}
                    ({info?.results.data.animeInfo.Japanese})
                  </Text>
                </Text>
              </RevealFx>
              <RevealFx
                speed="medium"
                delay={0}
                translateY={0}
                justifyContent="start"
              >
                <Text variant="label-default-xl">
                  <Text as="span" variant="label-strong-xl">
                    Aired:{" "}
                  </Text>{" "}
                  {info?.results.data.animeInfo.Aired}
                </Text>
              </RevealFx>
              {/* <RevealFx
                speed="medium"
                delay={0}
                translateY={0}
                justifyContent="start"
              >
                <Text variant="label-default-xl">
                  Duration:{" "}
                  {info?.results.data.animeInfo.Duration.replace(
                    "m",
                    " Minutes"
                  )}
                </Text>
              </RevealFx> */}
              <RevealFx
                speed="medium"
                delay={0}
                translateY={0}
                justifyContent="start"
              >
                <Text variant="label-default-xl">
                  <Text as="span" variant="label-strong-xl">
                    Status:{" "}
                  </Text>
                  {info?.results.data.animeInfo.Status}
                </Text>
              </RevealFx>
              <RevealFx
                speed="medium"
                delay={0}
                translateY={0}
                justifyContent="start"
              >
                <Text variant="label-default-xl">
                  <Text as="span" variant="label-strong-xl">
                    Score:{" "}
                  </Text>
                  {info?.results.data.animeInfo["MAL Score"]}
                </Text>
              </RevealFx>
              <RevealFx
                speed="medium"
                delay={0}
                translateY={0}
                justifyContent="start"
              >
                <Text variant="label-default-xl">
                  <Text as="span" variant="label-strong-xl">
                    Studio:{" "}
                  </Text>
                  {info?.results.data.animeInfo.Producers?.join(", ") ||
                    "Unknown"}
                </Text>
              </RevealFx>
            </Column>
          </Row>
          <Row gap="12">
            {info?.results.data.animeInfo.Genres.map((genre) => (
              <Grid
                key={genre}
                background="brand-medium"
                border="brand-medium"
                radius="l"
                padding="12"
              >
                <Text>{genre}</Text>
              </Grid>
            ))}
          </Row>
          <Text
            as="span"
            variant="label-default-xl"
            style={{
              fontFamily: "var(--font-family-code)",
            }}
          >
            {info?.results.data.animeInfo.Overview}
          </Text>
          <Grid columns={5} gap="12">
            {info?.results.data.charactersVoiceActors.map((char, index) => (
              <User
                key={index}
                name={char.character.name}
                subline={char.character.cast}
                avatarProps={{
                  empty: false,
                  src: char.character.poster,
                }}
              />
            ))}
          </Grid>
          <Grid columns={5} gap="12">
            {info?.results.seasons.map((season, index) => (
              <User
                key={index}
                name={season.title}
                subline={season.season}
                avatarProps={{
                  empty: false,
                  src: season.season_poster,
                }}
              />
            ))}
          </Grid>
          <Column
            border="brand-medium"
            gap="2"
            radius="l"
            padding="12"
            paddingTop="16"
            background="brand-medium"
          >
            {episodes?.results.episodes.map((episode) => (
              <SmartLink href={`/${id}`} key={episode.id}>
                <Text onBackground="brand-medium" style={{ cursor: "pointer" }}>
                  {episode.title}
                  <Text as="span" onBackground="accent-strong">
                    {" - "}Episode {episode.episode_no}
                  </Text>
                </Text>
              </SmartLink>
            ))}
          </Column>
        </Column>
      </Flex>
    </Column>
  );
};

export default Page;
