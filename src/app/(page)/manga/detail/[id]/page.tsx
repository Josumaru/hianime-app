"use client";
import ChapterList from "@/components/manga/chapter-list";
import { decrypt, encrypt } from "@/lib/crypto";
import { getManagdexFeed, getMangadexDetail } from "@/lib/mangadex";
import { useMangadexStore } from "@/lib/store";
import {
  Accordion,
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
  Text,
  useToast,
} from "@/once-ui/components";
import { MangadexFeed } from "@/types/manga/feed";
import { NextPage } from "next";
import { Fragment, use, useEffect, useState } from "react";
import { remark } from "remark";
import html from "remark-html";
interface Props {
  params: Promise<{
    id: string;
  }>;
}

const Page: NextPage<Props> = ({ params }) => {
  const id = use(params).id;
  const { detailManga, setDetailManga, feedManga, setFeedManga } =
    useMangadexStore();
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();
  let currrentVolume = "1";
  let currrentChapter = "1";
  let currentVolumeShowed = false;
  let currentChapterShowed = false;
  const reverseProxy = process.env.NEXT_PUBLIC_REVERSE_PROXY;
  const mangaStatus: {
    key: string;
    value: string;
  }[] = [
    {
      key: "Status",
      value: `${detailManga?.data.attributes.status
        ?.charAt(0)
        .toUpperCase()}${detailManga?.data.attributes.status.slice(1)}`,
    },
    {
      key: "Year",
      value: `${detailManga?.data.attributes.year}`,
    },
    {
      key: "Languages",
      value:
        detailManga?.data.attributes.availableTranslatedLanguages
          .join(", ")
          .toUpperCase() ?? "",
    },
    {
      key: "Author",
      value:
        detailManga?.data.relationships.find((rel) => rel.type == "author")
          ?.attributes?.name ?? "Unknown",
    },
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!id) {
          throw new Error("Hmm, where yout get the url ? Hahaha !!!");
        }
        if (!detailManga) {
          const detailResponse = await getMangadexDetail(decrypt(id));
          setDetailManga(detailResponse);
        } else {
          throw new Error(
            "Oooh no..., Your manga chapter is not available (ㅠ﹏ㅠ)"
          );
        }

        if (!feedManga) {
          const feedResponse = await getManagdexFeed(decrypt(id));
          setFeedManga(feedResponse);
        } else {
          throw new Error(
            "Oooh no..., Your manga episodes is not available (ㅠ﹏ㅠ)"
          );
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

  useEffect(() => {
    const fetchData = async () => {
      const processedContent = await remark()
        .use(html)
        .process(detailManga?.data.attributes.description.en ?? "");
      const contentHtml = processedContent.toString();
      setDescription(contentHtml);
    };
    fetchData();
  }, [detailManga]);
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
        <Column gap="12" border="neutral-alpha-weak" radius="xl" padding="12">
          <Row gap="12" hide="s">
            <GlitchFx speed="medium">
              <Avatar
                size="xl"
                src={`${reverseProxy}https://uploads.mangadex.org/covers/${decrypt(
                  id
                )}/${
                  detailManga?.data.relationships.find(
                    (rel) => rel.type == "cover_art"
                  )?.attributes?.fileName
                }.256.jpg`}
                loading={loading}
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
                  {detailManga?.data.attributes.title.en}
                  <Text as="span" variant="label-default-xl">
                    (
                    {
                      detailManga?.data.attributes.altTitles.find(
                        (alt) => alt.ja
                      )?.ja
                    }
                    )
                  </Text>
                </Text>
              </RevealFx>
              <RevealFx
                speed="medium"
                delay={0}
                translateY={0}
                justifyContent="start"
              >
                <table>
                  <tbody>
                    {mangaStatus.map((status, index) => (
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
            gap="12"
            show="s"
            justifyContent="center"
            alignItems="center"
            maxWidth={"l"}
          >
            <GlitchFx speed="medium">
              <Avatar
                size="xl"
                src={`${reverseProxy}https://uploads.mangadex.org/covers/${decrypt(
                  id
                )}/${
                  detailManga?.data.relationships.find(
                    (rel) => rel.type == "cover_art"
                  )?.attributes?.fileName
                }.256.jpg`}
                loading={loading}
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
                  {detailManga?.data.attributes.title.en}
                  <Text as="span" variant="label-default-xl">
                    (
                    {
                      detailManga?.data.attributes.altTitles.find(
                        (alt) => alt.ja
                      )?.ja
                    }
                    )
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
                    {mangaStatus.map((status, index) => (
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
          <Scroller fillWidth border="transparent" maxWidth={"l"}>
            {detailManga?.data.attributes.tags.map((genre) => (
              <Flex
                key={genre.id}
                background="brand-medium"
                border="brand-medium"
                radius="l"
                marginRight="12"
                padding="12"
              >
                <Text
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    WebkitLineClamp: 1,
                  }}
                >
                  {genre.attributes.name.en}
                </Text>
              </Flex>
            ))}
          </Scroller>
          <Text onBackground="brand-medium">Overview</Text>
          <Text
            as="span"
            variant="label-default-xl"
            dangerouslySetInnerHTML={{ __html: description ?? "" }}
          ></Text>
          {/* {info?.results.data.charactersVoiceActors != undefined &&
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
          </Grid> */}
          <ChapterList />          
        </Column>
      </Flex>
    </Column>
  );
};

export default Page;
