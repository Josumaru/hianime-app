"use client";
import ChapterList from "@/components/manga/chapter-list";
import { decrypt, encrypt } from "@/lib/crypto";
import { getMangadexFeed, getMangadexDetail } from "@/lib/mangadex";
import { useMangadexStore } from "@/lib/store";
import {
  Avatar,
  Background,
  Column,
  Flex,
  GlitchFx,
  LetterFx,
  RevealFx,
  Row,
  Scroller,
  Spinner,
  Tag,
  Text,
  useToast,
} from "@/once-ui/components";
import { NextPage } from "next";
import { use, useEffect, useState } from "react";
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
      value: `${detailManga?.data.attributes.year ?? new Date().getFullYear()}`,
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
        if (!detailManga || detailManga.data.id != id) {
          const detailResponse = await getMangadexDetail(decrypt(id));
          setDetailManga(detailResponse);
          const feedResponse = await getMangadexFeed(decrypt(id));
          setFeedManga(feedResponse);
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
        <Column
          fillWidth
          gap="12"
          border="neutral-alpha-weak"
          radius="xl"
          padding="12"
        >
          <Row gap="12" hide="s" fillWidth>
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
            fillWidth
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
              <Tag
                key={genre.id}
                radius="l"
                variant="brand"
                marginRight="8"
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
              </Tag>
            ))}
          </Scroller>
          {description && <Text onBackground="brand-medium">Overview</Text>}
          <Text
            as="span"
            variant="label-default-xl"
            align="justify"
            dangerouslySetInnerHTML={{ __html: description ?? "" }}
          ></Text>
          <ChapterList />
        </Column>
      </Flex>
    </Column>
  );
};

export default Page;
