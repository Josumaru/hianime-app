"use client";
import { decrypt, encrypt } from "@/lib/crypto";
import { getEpisodes, getInfo } from "@/lib/hianime";
import {
  Avatar,
  Background,
  Column,
  Flex,
  GlitchFx,
  Grid,
  LetterFx,
  RevealFx,
  Row,
  Scroller,
  SmartLink,
  Spinner,
  Tag,
  Text,
  User,
  useToast,
} from "@/once-ui/components";
import { Episodes } from "@/types/anime/episodes";
import { Info } from "@/types/anime/info";
import { NextPage } from "next";
import { Fragment, use, useEffect, useState } from "react";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

const Page: NextPage<Props> = ({ params }) => {
  const id = decrypt(use(params).id);
  const [info, setInfo] = useState<Info | null>(null);
  const [episodes, setEpisodes] = useState<Episodes | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();
  const animeStatus: {
    key: string;
    value: string;
  }[] = [
    {
      key: "Status",
      value: info?.results.data.animeInfo.Status ?? "Finished Airing",
    },
    {
      key: "Score",
      value:
        info?.results.data.animeInfo["MAL Score"] == "?"
          ? "10.0"
          : info?.results.data.animeInfo["MAL Score"] ?? "10.0",
    },
    {
      key: "Quality",
      value: info?.results.data.animeInfo.tvInfo?.quality ?? "HD",
    },
    {
      key: "Duration",
      value:
        info?.results.data.animeInfo.tvInfo.duration?.replace(
          "m",
          " Minutes"
        ) ?? "23 Minutes",
    },
    {
      key: "Producers",
      value: info?.results.data.animeInfo?.Producers?.join(", ") ?? "Unknown",
    },
    {
      key: "Studio",
      value: info?.results.data.animeInfo.Studios ?? "Unknown",
    },
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!id) {
          throw new Error("Hmm, where yout get the url ? Hahaha !!!");
        }
        const infoResponse = await getInfo(id);
        const episodeResponse = await getEpisodes(id);
        if (episodeResponse.results.episodes) {
          setEpisodes(episodeResponse);
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
  }, [id]);
  return error ? (
    <Flex fillHeight fillWidth justifyContent="center" alignItems="center">
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
    </Flex>
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
        <Column
          gap="12"
          border="neutral-alpha-weak"
          radius="xl"
          padding="12"
          fillWidth
        >
          <Row gap="12" hide="s" fillWidth>
            <GlitchFx speed="medium">
              <Avatar
                size="xl"
                src={info?.results.data.poster}
                loading={info?.results.data.poster == undefined}
              />
            </GlitchFx>
            <Column>
              <RevealFx
                speed="medium"
                delay={0}
                translateY={0}
                justifyContent="start"
              >
                <table>
                  <tbody>
                    {animeStatus.map((status, index) => (
                      <tr key={index}>
                        <td>
                          <Text variant="label-strong-xl">{status.key}</Text>
                        </td>
                        <td
                          style={{
                            paddingLeft: 20,
                          }}
                        >
                          <Text
                            variant="label-default-xl"
                            onBackground="info-medium"
                          >
                            {status.value}
                          </Text>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </RevealFx>
            </Column>
          </Row>
          <Column
            fillWidth
            gap="12"
            show="s"
            justifyContent="center"
            alignItems="center"
          >
            <GlitchFx speed="medium">
              <Avatar
                size="xl"
                src={info?.results.data.poster}
                loading={info?.results.data.poster == undefined}
              />
            </GlitchFx>
            <Column>
              <RevealFx
                speed="medium"
                delay={0}
                align="center"
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
                marginTop="s"
                translateY={0}
                justifyContent="start"
              >
                <table>
                  <tbody>
                    {animeStatus.map((status, index) => (
                      <tr key={index}>
                        <td>
                          <Text variant="label-strong-xl">{status.key}</Text>
                        </td>
                        <td
                          style={{
                            paddingLeft: 20,
                          }}
                        >
                          <Text
                            variant="label-default-xl"
                            onBackground="info-medium"
                          >
                            {status.value}
                          </Text>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </RevealFx>
            </Column>
          </Column>
          <Scroller fillWidth>
            {info?.results.data.animeInfo.Genres.map((genre) => (
              <Tag
                marginRight="8"
                fillWidth
                key={genre}
                background="brand-medium"
                border="brand-medium"
                radius="l"
                variant="brand"
              >
                <Text
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    WebkitLineClamp: 1,
                  }}
                >
                  {genre}
                </Text>
              </Tag>
            ))}
          </Scroller>
          <Text onBackground="brand-medium">Overview</Text>
          <Text
            as="span"
            style={{
              textAlign: "justify",
            }}
            variant="label-default-xl"
            dangerouslySetInnerHTML={{
              __html: info?.results.data.animeInfo.Overview ?? "",
            }}
          ></Text>
          {info?.results.data.charactersVoiceActors != undefined &&
            info?.results.data.charactersVoiceActors.length > 0 && (
              <Text onBackground="brand-medium">Character</Text>
            )}
          <Grid columns={4} gap="12" tabletColumns={3} mobileColumns={1}>
            {info?.results.data.charactersVoiceActors.map((char, index) => (
              <Fragment key={index}>
                <User
                  name={char.character.name}
                  subline={char.character.cast}
                  avatarProps={{
                    empty: false,
                    src: char.character.poster,
                  }}
                />
              </Fragment>
            ))}
          </Grid>
          {info?.results.seasons != undefined &&
            info?.results.seasons.length > 0 && (
              <Text onBackground="brand-medium">Related</Text>
            )}
          <Grid
            columns={4}
            gap="12"
            tabletColumns={3}
            mobileColumns={1}
            fillWidth
          >
            {info?.results.seasons.slice(0, 8).map((season, index) => (
              <Fragment>
                <User
                  key={index}
                  name={season.title}
                  subline={season.season}
                  avatarProps={{
                    empty: false,
                    src: season.season_poster,
                  }}
                />
              </Fragment>
            ))}
          </Grid>
          {episodes?.results.episodes.length != 0 && (
            <Fragment>
              <Text onBackground="brand-medium">Episodes</Text>
              <Column
                border="brand-medium"
                gap="2"
                radius="l"
                padding="12"
                paddingTop="16"
                background="brand-medium"
              >
                {episodes?.results.episodes.map((episode, index) => (
                  <SmartLink
                    href={`/anime/watch/${encrypt(`${id}(-|-)${episode.id}`)}`}
                    key={episode.id}
                  >
                    <Text
                      onBackground="brand-medium"
                      style={{ cursor: "pointer" }}
                    >
                      {episode.japanese_title ?? episode.title}
                      <Text as="span" onBackground="accent-strong">
                        {" - "}Episode {episode.episode_no}
                      </Text>
                    </Text>
                  </SmartLink>
                ))}
              </Column>
            </Fragment>
          )}
        </Column>
      </Flex>
    </Column>
  );
};

export default Page;
