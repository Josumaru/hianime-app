"use client";
import { NextPage } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import {
  MediaPlayerInstance,
  MediaProvider,
  Poster,
  Track,
  MediaPlayer,
  useMediaPlayer,
} from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import { use, useEffect, useRef, useState } from "react";
import { Stream } from "@/types/anime/stream";
import {
  Button,
  Column,
  Flex,
  Grid,
  Heading,
  LetterFx,
  Row,
  SegmentedControl,
  SmartImage,
  SmartLink,
  Spinner,
  Switch,
  Tag,
  Text,
  User,
  useToast,
} from "@/once-ui/components";
import { getEpisodes, getInfo, getStream } from "@/lib/hianime";
import { Servers } from "@/types/anime/servers";
import { decrypt, encrypt } from "@/lib/crypto";
import { Episode, Episodes } from "@/types/anime/episodes";
import { Info } from "@/types/anime/info";
import Link from "next/link";
import { useHianimeStore } from "@/lib/store";
import { createCookies, getCookies } from "@/action/cookies-action";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

const constructOptions = (episodes: Episode[], rangeSize: number) => {
  const groupedOptions = [];

  for (let i = 0; i < episodes.length; i += rangeSize) {
    const rangeStart = episodes[i].episode_no;
    const rangeEnd =
      episodes[Math.min(i + rangeSize - 1, episodes.length - 1)].episode_no; // Correctly calculate the last episode number in range
    const label = `${rangeStart}-${rangeEnd}`;

    groupedOptions.push({
      label,
      prefixIcon: "",
      suffixIcon: "",
      value: label,
    });
  }

  return groupedOptions;
};

const Page: NextPage<Props> = ({ params }) => {
  const id = decrypt(use(params).id);
  const { episodes, setEpisodes } = useHianimeStore();
  const { stream, setStream } = useHianimeStore();
  const { info, setInfo } = useHianimeStore();
  const [error, setError] = useState<string | null>(null);
  const [rangeSize, setRangeSize] = useState<number[]>([0, 24]);
  const [loading, setLoading] = useState<boolean>(true);
  const [changingEpisode, setChangingEpisode] = useState<boolean>(false);
  const [currentSegment, setCurrentSegment] = useState<string | null>(null);
  const [currentStream, setCurrentStream] = useState<string | null>(null);
  const [currentTitle, setCurrentTitle] = useState<string | null>(null);
  const [nextId, setNextId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [autoPlay, setAutoPlay] = useState<boolean>(true);
  const [autoSkip, setAutoSkip] = useState<boolean>(true);
  const { addToast } = useToast();
  const player = useRef<MediaPlayerInstance>(null);
  const router = useRouter();
  const handleEpisodeChange = async (id: string) => {
    // setChangingEpisode(true);
    // try {
    //   const response = await getStream(id);
    // //   alert(response.stream.results.streamingLink.link.file)
    //   setCurrentStream(response.stream.results.streamingLink.link.file);
    // } catch (error: any) {
    //   addToast({
    //     message: error.message,
    //     variant: "danger",
    //   });
    // } finally {
    //   setChangingEpisode(false);
    // }
  };

  useEffect(() => {
    // if (currentTime == 0) {
    //   return;
    // }
    try {
      if (
        autoPlay &&
        player.current?.state.duration &&
        currentTime > player.current?.state.duration - 1
      ) {
        if (nextId) {
          router.push(`/anime/watch/${encrypt(nextId ?? "")}`);
        }
      }
      if (autoSkip) {
        const startIntro = stream?.stream.results.streamingLink.intro.start;
        const endIntro = stream?.stream.results.streamingLink.intro.end;
        const startOutro = stream?.stream.results.streamingLink.outro.start;
        const endOutro = stream?.stream.results.streamingLink.outro.end;
        if (startIntro != undefined && endIntro != undefined) {
          if (currentTime > startIntro && currentTime < endIntro) {
            player?.current?.remoteControl.seek(endIntro);
            addToast({
              message: "Yatta! Intro successfully skipped! ( ˶ˆᗜˆ˵ )",
              variant: "success",
            });
            return;
          }
        } else {
          throw new Error(
            "Impossible, this failure has never happened ૮(˶ㅠ︿ㅠ)ა"
          );
        }
        if (startOutro != undefined && endOutro != undefined) {
          if (currentTime > startOutro && currentTime < endOutro) {
            player?.current?.remoteControl.seek(endOutro);
            addToast({
              message: "Yatta! Outro successfully skipped! ( ˶ˆᗜˆ˵ )",
              variant: "success",
            });
            return;
          }
        } else {
          throw new Error(
            "Impossible, this failure has never happened ૮(˶ㅠ︿ㅠ)ა"
          );
        }
      }
    } catch (error: any) {
      if (!loading) {
        addToast({
          message: error.message,
          variant: "danger",
        });
      }
    }
  }, [currentTime]);

  useEffect(() => {
    player.current?.subscribe(({ currentTime }) => {
      setCurrentTime(currentTime);
    });
  }, [currentStream]);

  useEffect(() => {
    if (episodes) {
      for (let index = 0; index < episodes?.results.episodes.length; index++) {
        const episode = episodes?.results.episodes[index];
        if (episode.id == id) {
          setCurrentTitle(episode?.japanese_title ?? "");
          if (episodes?.results.episodes.length > index + 1) {
            setNextId(episodes?.results.episodes[index + 1]?.id);
          } else {
            setNextId(null);
          }
          break;
        }
      }
    }
  }, [episodes, id]);
  useEffect(() => {
    const fetchData = async () => {
      let streamResponse;
      let infoResponse;
      let episodesResponse;
      try {
        setLoading(true);

        if (!id) {
          throw new Error("Hmm..., You tried something ? (˶ᵔ ᵕ ᵔ˶)");
        }

        const autoPlayCookies = await getCookies("autoPlay");
        const autoSkipCookies = await getCookies("autoSkip");
        setAutoPlay(autoPlayCookies?.value == "true");
        setAutoSkip(autoSkipCookies?.value == "true");

        streamResponse = await getStream(id);
        setStream(streamResponse);
        setCurrentStream(streamResponse.stream.results.streamingLink.link.file);

        if (info && episodes) {
          episodes.results.episodes.map((episode, index) => {
            if (id == episode.id) {
              const currentSize = Math.floor(index / 24) * 24;
              const firstSize = currentSize + 1;
              const lastSize = currentSize + 24;
              setCurrentSegment(`${firstSize}-${lastSize}`);
              setRangeSize([firstSize - 1, lastSize]);
            }
          });
          return;
        }
        if (!info) {
          infoResponse = await getInfo(id);
          setInfo(infoResponse);
        }
        if (!episodes) {
          episodesResponse = await getEpisodes(id);
          episodesResponse?.results.episodes.find((episode) => episode.id == id)
            ?.japanese_title ?? "";
          episodesResponse.results.episodes.map((episode, index) => {
            if (id == episode.id) {
              const currentSize = Math.round(index / 24) * 24;
              const firstSize = currentSize + 1;
              const lastSize = currentSize + 24;
              setCurrentSegment(`${firstSize}-${lastSize}`);
              setRangeSize([firstSize - 1, lastSize]);
            }
          });
          setEpisodes(episodesResponse);
        }
        if (
          streamResponse?.stream.results.streamingLink.link &&
          infoResponse?.results.data.id &&
          episodesResponse?.results.episodes.length != 0
        ) {
          setError(null);
          addToast({
            message: "Yeay, enjoy your anime... ( ˶ˆᗜˆ˵ )",
            variant: "success",
          });
        } else {
          throw new Error("Hmm..., You're overloading my server !!! •`_´•");
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

  if (error) {
    return (
      <Flex justifyContent="center" fillWidth fillHeight>
        <LetterFx>
          <Text variant="code-default-l">{error}</Text>
        </LetterFx>
      </Flex>
    );
  }

  return loading ? (
    <Flex justifyContent="center" fillWidth fillHeight>
      <Spinner />
    </Flex>
  ) : (
    <Flex justifyContent="center" zIndex={9}>
      <Row paddingY="80" paddingX="s" maxWidth={"l"} fillWidth gap="12">
        <Column maxWidth={"s"} fillWidth gap={"12"}>
          {!changingEpisode && currentStream ? (
            <Column>
              <MediaPlayer
                ref={player}
                autoPlay={true}
                style={{ width: "100%" }}
                src={currentStream}
                title={currentTitle ?? ""}
              >
                <MediaProvider>
                  {stream?.stream.results.streamingLink.tracks.map(
                    (track, index) => (
                      <Track
                        key={`${index}`}
                        src={track.file}
                        kind={track.kind as TextTrackKind}
                        label={track.label}
                        default={track.label === "English"}
                      />
                    )
                  )}
                </MediaProvider>
                <DefaultVideoLayout icons={defaultLayoutIcons} />
              </MediaPlayer>
              <Row gap="16" marginTop="16" hide="s">
                <Switch
                  label="Skip Intro & Outro"
                  isChecked={autoSkip}
                  description="auto skip anime intro & outro"
                  onToggle={() => {
                    setAutoSkip(!autoSkip);
                    createCookies("autoSkip", !autoSkip);
                  }}
                />
                <Switch
                  label="Auto Play"
                  isChecked={autoPlay}
                  description="auto play to next episode"
                  onToggle={() => {
                    setAutoPlay(!autoPlay);
                    createCookies("autoPlay", !autoPlay);
                  }}
                />
              </Row>
              <Row gap="16" marginTop="16" show="s">
                <Switch
                  label="Skip Intro & Outro"
                  isChecked={autoSkip}
                  description=""
                  onToggle={() => {
                    setAutoSkip(!autoSkip);
                    createCookies("autoSkip", !autoSkip);
                  }}
                />
                <Switch
                  label="Auto Play"
                  isChecked={autoPlay}
                  description=""
                  onToggle={() => {
                    setAutoPlay(!autoPlay);
                    createCookies("autoPlay", !autoPlay);
                  }}
                />
              </Row>
            </Column>
          ) : (
            <Flex
              aspectRatio={16 / 9}
              fillWidth
              justifyContent="center"
              alignItems="center"
            >
              <Spinner></Spinner>
            </Flex>
          )}
          <Heading as="h3">
            {episodes?.results.episodes.find((episode) => episode.id == id)
              ?.japanese_title ?? ""}
          </Heading>
          <User
            name={info?.results.data.japanese_title}
            subline={info?.results.data.title}
            tagProps={{
              label: info?.results.data.showType,
              variant: "accent",
            }}
            avatarProps={{
              src: info?.results.data.poster,
            }}
          />
          <Column gap="4" fillWidth show="s">
            {(episodes?.results.episodes.length ?? 0) >= 23 &&
              currentSegment && (
                <SegmentedControl
                  onToggle={(p) => {
                    setRangeSize(
                      p.split("-").map((num, index) => {
                        if (index == 0) {
                          return parseInt(num, 10) - 1;
                        }
                        return parseInt(num, 10);
                      })
                    );
                  }}
                  buttons={constructOptions(
                    episodes?.results.episodes ?? [],
                    24
                  )}
                  defaultSelected={currentSegment}
                />
              )}
            <Heading as="h3">Episodes</Heading>
            <Grid rows={4} columns={6} gap="2" fillWidth>
              {episodes?.results.episodes
                .slice(rangeSize[0], rangeSize[1])
                .map((episode) => {
                  return (
                    <Flex
                      key={episode.id}
                      cursor="pointer"
                      justifyContent="center"
                      radius="m"
                      onClick={() => handleEpisodeChange(episode.id)}
                      border={
                        episode.filler ? "warning-strong" : "brand-strong"
                      }
                      background={
                        episode.filler
                          ? "warning-strong"
                          : episode.id == id
                          ? "brand-medium"
                          : "brand-strong"
                      }
                      onBackground={
                        episode.filler
                          ? "warning-medium"
                          : episode.id == id
                          ? "brand-medium"
                          : "brand-medium"
                      }
                    >
                      <SmartLink
                        href={`/anime/watch/${encrypt(episode.id)}`}
                        fillWidth
                      >
                        <Flex
                          fillWidth
                          justifyContent="center"
                          alignItems="center"
                          margin="8"
                        >
                          <Text align="center">{episode.episode_no}</Text>
                        </Flex>
                      </SmartLink>
                    </Flex>
                  );
                })}
            </Grid>
          </Column>
          <Column
            radius="l"
            background="brand-medium"
            border="brand-medium"
            padding="12"
          >
            <Text onBackground="brand-medium">
              {(() => {
                let genres = "";
                {
                  info?.results.data.animeInfo.Genres.map(
                    (genre) => (genres += `#${genre} `)
                  );
                }
                return genres;
              })()}
            </Text>
            <Text>{info?.results.data.animeInfo.Overview}</Text>
          </Column>
          {/* {data?.servers.results.map((server) => (
            <Button key={server.data_id} label={server.serverName} />
          ))} */}
          <Column gap="4" fillWidth show="s">
            <Heading as="h3">Recommendations</Heading>
            <Column gap="8">
              {info?.results.data.recommended_data
                .slice(0, 4)
                .map((recomended) => (
                  <Link
                    href={`/anime/detail/${encrypt(recomended.id)}`}
                    key={recomended.id}
                  >
                    <Row
                      gap="8"
                      padding="4"
                      background="brand-medium"
                      border="brand-medium"
                      radius="l"
                      cursor="pointer"
                    >
                      <SmartImage
                        src={recomended.poster}
                        aspectRatio="2/3"
                        fillWidth
                        width={"80"}
                        radius="m"
                      />
                      <Column gap="2" width={"xs"}>
                        <Text onBackground="brand-medium">
                          {recomended.japanese_title ?? recomended.title}
                        </Text>
                        <Text onBackground="brand-medium">
                          <Text as={"span"} onBackground="info-medium">
                            {" "}
                            {recomended.tvInfo.duration?.replaceAll(
                              "m",
                              " Min"
                            )}
                            {" - "}
                          </Text>
                          {recomended.tvInfo.eps ?? 1}
                          <Text as={"span"} onBackground="info-medium">
                            {" "}
                            Episodes
                          </Text>
                        </Text>
                        <Row gap="4">
                          <Tag
                            variant="brand"
                            label={
                              recomended.tvInfo.showType == ""
                                ? "Movie"
                                : recomended.tvInfo.showType
                            }
                          />
                          {recomended.adultContent && (
                            <Tag variant="danger" label="18+" />
                          )}
                        </Row>
                      </Column>
                    </Row>
                  </Link>
                ))}
            </Column>
          </Column>
        </Column>
        <Column gap="4" fillWidth maxWidth={"xs"} hide="s">
          {(episodes?.results.episodes.length ?? 0) >= 23 && currentSegment && (
            <SegmentedControl
              onToggle={(p) => {
                setRangeSize(
                  p.split("-").map((num, index) => {
                    if (index == 0) {
                      return parseInt(num, 10) - 1;
                    }
                    return parseInt(num, 10);
                  })
                );
              }}
              buttons={constructOptions(episodes?.results.episodes ?? [], 24)}
              defaultSelected={currentSegment}
            />
          )}
          <Heading as="h3">Episodes</Heading>
          <Grid rows={4} columns={6} gap="2" fillWidth>
            {episodes?.results.episodes
              .slice(rangeSize[0], rangeSize[1])
              .map((episode) => {
                return (
                  <Flex
                    key={episode.id}
                    cursor="pointer"
                    justifyContent="center"
                    radius="m"
                    onClick={() => handleEpisodeChange(episode.id)}
                    border={episode.filler ? "warning-strong" : "brand-strong"}
                    background={
                      episode.filler
                        ? "warning-strong"
                        : episode.id == id
                        ? "brand-medium"
                        : "brand-strong"
                    }
                    onBackground={
                      episode.filler
                        ? "warning-medium"
                        : episode.id == id
                        ? "brand-medium"
                        : "brand-medium"
                    }
                  >
                    <SmartLink
                      href={`/anime/watch/${encrypt(episode.id)}`}
                      fillWidth
                    >
                      <Flex
                        fillWidth
                        justifyContent="center"
                        alignItems="center"
                        margin="8"
                      >
                        <Text align="center">{episode.episode_no}</Text>
                      </Flex>
                    </SmartLink>
                  </Flex>
                );
              })}
          </Grid>
          <Heading as="h3">Recommendations</Heading>
          <Column gap="8">
            {info?.results.data.recommended_data
              .slice(0, 4)
              .map((recomended) => (
                <Link
                  href={`/anime/detail/${encrypt(recomended.id)}`}
                  key={recomended.id}
                >
                  <Row
                    gap="8"
                    padding="4"
                    background="brand-medium"
                    border="brand-medium"
                    radius="l"
                    cursor="pointer"
                  >
                    <SmartImage
                      src={recomended.poster}
                      aspectRatio="2/3"
                      fillWidth
                      width={"80"}
                      radius="m"
                    />
                    <Column gap="2" width={"xs"}>
                      <Text onBackground="brand-medium">
                        {recomended.japanese_title ?? recomended.title}
                      </Text>
                      <Text onBackground="brand-medium">
                        <Text as={"span"} onBackground="info-medium">
                          {" "}
                          {recomended.tvInfo.duration?.replaceAll("m", " Min")}
                          {" - "}
                        </Text>
                        {recomended.tvInfo.eps ?? 1}
                        <Text as={"span"} onBackground="info-medium">
                          {" "}
                          Episodes
                        </Text>
                      </Text>
                      <Row gap="4">
                        <Tag
                          variant="brand"
                          label={
                            recomended.tvInfo.showType == ""
                              ? "Movie"
                              : recomended.tvInfo.showType
                          }
                        />
                        {recomended.adultContent && (
                          <Tag variant="danger" label="18+" />
                        )}
                      </Row>
                    </Column>
                  </Row>
                </Link>
              ))}
          </Column>
        </Column>
      </Row>
    </Flex>
  );
};

export default Page;
