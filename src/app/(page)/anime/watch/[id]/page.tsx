"use client";
import { NextPage } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { MediaPlayer, MediaProvider, Poster, Track } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import { use, useEffect, useState } from "react";
import { Stream } from "@/types/stream";
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
  Tag,
  Text,
  User,
  useToast,
} from "@/once-ui/components";
import { getEpisodes, getInfo, getStream } from "@/lib/hianime";
import { Servers } from "@/types/servers";
import { decrypt, encrypt } from "@/lib/crypto";
import { Episode, Episodes } from "@/types/episodes";
import { Info } from "@/types/info";
import Link from "next/link";
import { useHianimeStore } from "@/lib/store";

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
  const [currentStream, setCurrentStream] = useState<string | null>(null);
  const { addToast } = useToast();
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
    const fetchData = async () => {
      let streamResponse;
      let infoResponse;
      let episodesResponse;
      try {
        setLoading(true);
        if (!id) {
          throw new Error("Hmm..., You tried something ? (˶ᵔ ᵕ ᵔ˶)");
        }
        streamResponse = await getStream(id);
        setStream(streamResponse);
        setCurrentStream(streamResponse.stream.results.streamingLink.link.file);
        if (info && episodes) {
          return;
        }
        if (!info) {
          infoResponse = await getInfo(id);
          setInfo(infoResponse);
        }
        if (!episodes) {
          episodesResponse = await getEpisodes(id);
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
            <MediaPlayer style={{ width: "100%" }} src={currentStream}>
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
            {(episodes?.results.episodes.length ?? 0) >= 23 && (
              <SegmentedControl
                onToggle={(p) => {
                  setRangeSize(
                    p.split("-").map((num) => parseInt(num, 10) - 1)
                  );
                }}
                buttons={constructOptions(episodes?.results.episodes ?? [], 24)}
              />
            )}
            <Heading as="h3">Episodes</Heading>
            <Grid rows={4} columns={6} gap="2" fillWidth>
              {episodes?.results.episodes
                .slice(rangeSize[0], rangeSize[1])
                .map((episode) => (
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
                ))}
            </Grid>
          </Column>
          <Column
            radius="l"
            background="brand-medium"
            border="brand-medium"
            padding="12"
          >
            <Row gap="8">
              {info?.results.data.animeInfo.Genres.map((genre) => (
                <Link key={genre} href={"/anime/genre"}>
                  <Text onBackground="brand-medium">{`#${genre}`}</Text>
                </Link>
              ))}
            </Row>
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
          {(episodes?.results.episodes.length ?? 0) >= 23 && (
            <SegmentedControl
              onToggle={(p) => {
                setRangeSize(p.split("-").map((num) => parseInt(num, 10) - 1));
              }}
              buttons={constructOptions(episodes?.results.episodes ?? [], 24)}
            />
          )}
          <Heading as="h3">Episodes</Heading>
          <Grid rows={4} columns={6} gap="2" fillWidth>
            {episodes?.results.episodes
              .slice(rangeSize[0], rangeSize[1])
              .map((episode) => (
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
              ))}
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
