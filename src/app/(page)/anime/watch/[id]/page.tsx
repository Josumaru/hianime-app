"use client";
import { NextPage } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import {
  MediaPlayerInstance,
  MediaProvider,
  Track,
  MediaPlayer,
} from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import { use, useEffect, useRef, useState } from "react";
import {
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
import { decrypt, encrypt } from "@/lib/crypto";
import { Episode } from "@/types/anime/episodes";
import Link from "next/link";
import { useHianimeStore } from "@/lib/store";
import { createCookies, getCookies } from "@/action/cookies-action";
import { AnimePreferences } from "@/types/anime/anime-preferences";
import { UserWatch } from "@/once-ui/components/UserWatch";

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
  const [aid, eid] = decrypt(use(params).id).split("(-|-)");

  const { episodes, setEpisodes } = useHianimeStore();
  const { stream, setStream } = useHianimeStore();
  const { info, setInfo } = useHianimeStore();
  const [error, setError] = useState<string | null>(null);
  const [rangeSize, setRangeSize] = useState<number[]>([0, 24]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentSegment, setCurrentSegment] = useState<string | null>(null);
  const [currentStream, setCurrentStream] = useState<string | null>(null);
  const [currentTitle, setCurrentTitle] = useState<string | null>(null);
  const [nextId, setNextId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [preferences, setPreferences] = useState<AnimePreferences>({
    autoPlay: true,
    autoSkip: true,
  });
  const { addToast } = useToast();
  const player = useRef<MediaPlayerInstance>(null);
  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    try {
      if (
        preferences.autoPlay &&
        player.current?.state.duration &&
        currentTime > player.current?.state.duration - 1
      ) {
        if (nextId) {
          router.push(`/anime/watch/${encrypt(nextId ?? "")}`);
        }
      }
      if (preferences.autoSkip) {
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
    intervalRef.current = setInterval(() => {
      const time = player.current?.state.currentTime;
      if (time !== undefined) {
        setCurrentTime(Math.floor(time));
      }
    }, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [player]);

  useEffect(() => {
    if (episodes) {
      for (let index = 0; index < episodes?.results.episodes.length; index++) {
        const episode = episodes?.results.episodes[index];
        if (episode.id == eid) {
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
  }, [episodes, eid]);
  useEffect(() => {
    const formData = new FormData();
    const fetchData = async () => {
      let streamResponse;
      let infoResponse;
      let episodesResponse;
      try {
        setLoading(true);

        if (!eid) {
          throw new Error("Hmm..., You tried something ? (˶ᵔ ᵕ ᵔ˶)");
        }

        const settings = (await getCookies(
          "_animanga_a_s",
          "anime"
        )) as AnimePreferences;
        if (settings) {
          setPreferences(settings);
        }

        streamResponse = await getStream(eid);
        setStream(streamResponse);
        setCurrentStream(streamResponse.stream.results.streamingLink.link.file);

        if (info && episodes) {
          episodes.results.episodes.map((episode, index) => {
            if (eid == episode.id) {
              const currentSize = Math.floor(index / 24) * 24;
              const firstSize = currentSize + 1;
              const lastSize = currentSize + 24;
              setCurrentSegment(`${firstSize}-${lastSize}`);
              setRangeSize([firstSize - 1, lastSize]);
              formData.append("episode", `${episode.episode_no}`);
              formData.append("animeId", info.results.data.id);
              formData.append("animeTitle", info.results.data.title);
              formData.append("title", episode.japanese_title);
              formData.append("episodeId", episode.id);
              formData.append("cover", info.results.data.poster);
              fetch("/api/v1/anime-history", {
                method: "POST",
                body: formData,
              });
            }
          });
          return;
        }
        if (!info) {
          infoResponse = await getInfo(aid);
          setInfo(infoResponse);
          formData.append("animeId", infoResponse.results.data.id);
          formData.append("animeTitle", infoResponse.results.data.title);
          formData.append("cover", infoResponse.results.data.poster);
          fetch("/api/v1/anime-history", {
            method: "POST",
            body: formData,
          });
        }
        if (!episodes) {
          episodesResponse = await getEpisodes(aid);
          episodesResponse?.results.episodes.find(
            (episode) => episode.id == eid
          )?.japanese_title ?? "";
          episodesResponse.results.episodes.map((episode, index) => {
            if (eid == episode.id) {
              const currentSize = Math.round(index / 24) * 24;
              const firstSize = currentSize + 1;
              const lastSize = currentSize + 24;
              setCurrentSegment(`${firstSize}-${lastSize}`);
              setRangeSize([firstSize - 1, lastSize]);
              formData.append("episode", `${episode.episode_no}`);
              formData.append("title", episode.japanese_title);
              formData.append("episodeId", episode.id);
              fetch("/api/v1/anime-history", {
                method: "POST",
                body: formData,
              });
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

  useEffect(() => {
    const saveUserSettings = async (settings: object) => {
      await createCookies("_animanga_a_s", settings, "anime");
    };
    saveUserSettings(preferences);
  }, [preferences]);

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
    <Flex justifyContent="center" zIndex={1}>
      <Row paddingY="80" paddingX="s" maxWidth={"l"} fillWidth gap="12">
        <Column maxWidth={"s"} fillWidth gap={"12"}>
          {currentStream ? (
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
                        src={`https://proxy.josumaru.my.id?url=${track.file}`}
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
                  isChecked={preferences.autoSkip}
                  description="auto skip anime intro & outro"
                  onToggle={() => {
                    setPreferences({
                      ...preferences,
                      autoSkip: !preferences.autoSkip,
                    });
                  }}
                />
                <Switch
                  label="Auto Play"
                  isChecked={preferences.autoPlay}
                  description="auto play to next episode"
                  onToggle={() => {
                    setPreferences({
                      ...preferences,
                      autoPlay: !preferences.autoPlay,
                    });
                  }}
                />
              </Row>
              <Row gap="16" marginTop="16" show="s">
                <Switch
                  label="Skip Intro & Outro"
                  isChecked={preferences.autoSkip}
                  description=""
                  onToggle={() => {
                    setPreferences({
                      ...preferences,
                      autoSkip: !preferences.autoSkip,
                    });
                  }}
                />
                <Switch
                  label="Auto Play"
                  isChecked={preferences.autoPlay}
                  description=""
                  onToggle={() => {
                    setPreferences({
                      ...preferences,
                      autoPlay: !preferences.autoPlay,
                    });
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
          <Heading
            as="h3"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              lineClamp: 2,
              maxLines: 2,
              maxWidth: "100%",
            }}
          >
            {episodes?.results.episodes.find((episode) => episode.id == eid)
              ?.japanese_title ?? ""}
          </Heading>
          <UserWatch
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
                      border={
                        episode.filler ? "warning-strong" : "brand-strong"
                      }
                      background={
                        episode.filler
                          ? "warning-strong"
                          : episode.id == eid
                          ? "brand-medium"
                          : "brand-strong"
                      }
                      onBackground={
                        episode.filler
                          ? "warning-medium"
                          : episode.id == eid
                          ? "brand-medium"
                          : "brand-medium"
                      }
                    >
                      <SmartLink
                        href={`/anime/watch/${encrypt(
                          `${aid}(-|-)${episode.id}`
                        )}`}
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
            <Text align="justify">{info?.results.data.animeInfo.Overview}</Text>
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
                    border={episode.filler ? "warning-strong" : "brand-strong"}
                    background={
                      episode.filler
                        ? "warning-strong"
                        : episode.id == eid
                        ? "brand-medium"
                        : "brand-strong"
                    }
                    onBackground={
                      episode.filler
                        ? "warning-medium"
                        : episode.id == eid
                        ? "brand-medium"
                        : "brand-medium"
                    }
                  >
                    <SmartLink
                      href={`/anime/watch/${encrypt(
                        `${aid}(-|-)${episode.id}`
                      )}`}
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
