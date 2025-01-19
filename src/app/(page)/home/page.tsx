"use client";

import React, { useEffect, useState } from "react";

import {
  Heading,
  Text,
  InlineCode,
  Logo,
  SmartLink,
  Background,
  useToast,
  Column,
  Row,
  Flex,
  Spinner,
} from "@/once-ui/components";
import SpotlightCarousel from "@/components/home/spotlight-carousel";
import { NextPage } from "next";
import { getHianime } from "@/lib/hianime";
import LatestEpisodeScroller from "@/components/home/latest-episode-scroller";
import TrendingScroller from "@/components/home/trending-scroller";
import { useHianimeStore } from "@/lib/store";
import AnimeSchedule from "@/components/home/anime-schedule";

const Home: NextPage = () => {
  const { hianime, setHianime } = useHianimeStore();
  const [loading, setLoading] = useState<boolean>(false);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (hianime) return;
      try {
        setLoading(true);
        const response = await getHianime();
        setHianime(response);
        addToast({
          message: "Data loaded successfully",
          variant: "success",
        });
      } catch (error: any) {
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
        <Column
          fillWidth
          alignItems="center"
          gap="48"
          radius="xl"
          position="relative"
        >
          <Background
            mask={{
              x: 0,
              y: 48,
            }}
            position="absolute"
            grid={{
              display: true,
              width: "0.25rem",
              color: "neutral-alpha-medium",
              height: "0.25rem",
            }}
          />
          <Background
            mask={{
              x: 80,
              y: 0,
              radius: 100,
            }}
            position="absolute"
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
            position="absolute"
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
          <Column fillWidth alignItems="center" gap="32" position="relative">
            {loading || !hianime ? (
              <Flex
                width={"l"}
                alignItems="center"
                justifyContent="center"
                aspectRatio={"16/9"}
              >
                <Spinner />
              </Flex>
            ) : (
              <>
                <SpotlightCarousel params={hianime?.results.spotlights ?? []} />
                <InlineCode
                  radius="xl"
                  shadow="m"
                  fit
                  paddingX="16"
                  paddingY="8"
                  hide="s"
                >
                  Start by watching
                  <SmartLink
                    href={`/${hianime?.results.latestEpisode[0].id}`}
                    target="_blank"
                  >
                    <Text
                      onBackground="brand-medium"
                      marginLeft="8"
                      style={{ cursor: "pointer" }}
                    >
                      {hianime?.results.latestEpisode[0].japanese_title}
                    </Text>
                  </SmartLink>
                </InlineCode>
                <InlineCode
                  radius="xl"
                  shadow="m"
                  fit
                  paddingX="16"
                  paddingY="8"
                  show="s"
                >
                  Start by watching
                  <SmartLink
                    href={`/${hianime?.results.latestEpisode[0].id}`}
                    target="_blank"
                  >
                    <Text
                      onBackground="brand-medium"
                      marginLeft="8"
                      style={{ cursor: "pointer" }}
                    >
                      {hianime.results.latestEpisode[0].japanese_title.length >
                      10
                        ? `${hianime.results.latestEpisode[0].japanese_title.substring(
                            0,
                            10
                          )}...`
                        : hianime.results.latestEpisode[0].japanese_title}
                    </Text>
                  </SmartLink>
                </InlineCode>
                <Heading as="h2" variant="display-default-m">
                  Latest Episode
                </Heading>
                <Text
                  marginBottom="32"
                  align="center"
                  onBackground="neutral-weak"
                >
                  New episodes that are sure to get you excited
                </Text>
                <LatestEpisodeScroller
                  params={hianime?.results.latestEpisode ?? []}
                />
                <Heading as="h2" variant="display-default-m">
                  Trending
                </Heading>
                <Text
                  marginBottom="32"
                  align="center"
                  onBackground="neutral-weak"
                >
                  There are so many who see this anime
                </Text>
                <TrendingScroller params={hianime?.results.trending ?? []} />

                <AnimeSchedule />
              </>
            )}
            {/* <Heading
              wrap="balance"
              variant="display-default-l"
              align="center"
              marginBottom="16"
            >
              We let designers code and developers design
            </Heading>
            <Column alignItems="center" paddingTop="64" fillWidth gap="24">
              <AvatarGroup
                marginBottom="8"
                reverse
                size="l"
                avatars={[
                  {
                    src: "https://github.com/josumaru.png",
                  },
                  {
                    src: "https://github.com/josumaru.png",
                  },
                ]}
              />
              <Heading
                marginBottom="12"
                as="h2"
                align="center"
                variant="heading-default-l"
              >
                Brought to you by indie creators
                <br /> behind stellar projects:
              </Heading>
              <LogoCloud
                paddingBottom="104"
                columns="3"
                mobileColumns="1"
                limit={3}
                fillWidth
                logos={[
                  {
                    icon: false,
                    wordmarkSrc: "/trademark/dopler-wordmark.svg",
                    href: "https://dropler.app",
                    size: "m",
                  },
                  {
                    icon: false,
                    wordmarkSrc: "/trademark/design-engineers-wordmark.svg",
                    href: "https://club.dropler.io",
                    size: "m",
                  },
                  {
                    icon: false,
                    wordmarkSrc: "/trademark/enroll-wordmark.svg",
                    href: "https://enroll.dopler.app",
                    size: "m",
                  },
                  {
                    icon: false,
                    wordmarkSrc: "/trademark/magic-portfolio-wordmark.svg",
                    href: "https://magic-portfolio.com",
                    size: "m",
                  },
                ]}
              />
            </Column> */}
          </Column>
          {/* <Row
            position="relative"
            fillWidth
            paddingX="32"
            paddingTop="160"
            minHeight={28}
            paddingBottom="80"
            justifyContent="center"
            alignItems="flex-end"
          >
            <Background
              mask={{
                x: 50,
                y: 100,
              }}
              position="absolute"
              grid={{
                display: true,
                width: "0.25rem",
                color: "brand-alpha-strong",
                height: "0.25rem",
              }}
            />
            <Row
              position="relative"
              textVariant="display-default-m"
              align="center"
            >
              Learn more
            </Row>
          </Row>
          <Row fillWidth overflow="hidden">
            <Row
              maxWidth="32"
              borderTop="neutral-alpha-weak"
              borderBottom="neutral-medium"
            ></Row>
            <Row fillWidth border="neutral-alpha-weak" mobileDirection="column">
              {links.map((link, index) => (
                <SmartLink
                  unstyled
                  fillWidth
                  target="_blank"
                  key={link.href}
                  href={link.href}
                >
                  <Card
                    fillWidth
                    padding="40"
                    gap="8"
                    direction="column"
                    background={undefined}
                    borderRight={
                      index < links.length - 1
                        ? "neutral-alpha-weak"
                        : undefined
                    }
                    border={undefined}
                    radius={undefined}
                  >
                    <Row
                      fillWidth
                      justifyContent="center"
                      gap="12"
                      alignItems="center"
                    >
                      <Text
                        variant="body-strong-m"
                        onBackground="neutral-strong"
                      >
                        {link.title}
                      </Text>
                      <Icon size="s" name="arrowUpRight" />
                    </Row>
                    <Text
                      align="center"
                      variant="body-default-s"
                      onBackground="neutral-weak"
                    >
                      {link.description}
                    </Text>
                  </Card>
                </SmartLink>
              ))}
            </Row>
            <Row
              maxWidth="32"
              borderTop="neutral-alpha-weak"
              borderBottom="neutral-medium"
            ></Row>
          </Row> */}
          <Row
            position="relative"
            as="footer"
            fillWidth
            paddingX="l"
            paddingTop="128"
            paddingBottom="80"
          >
            <Background
              borderTop="brand-alpha-strong"
              mask={{
                x: 50,
                y: 0,
              }}
              position="absolute"
              grid={{
                display: true,
                width: "0.25rem",
                color: "brand-alpha-strong",
                height: "0.25rem",
              }}
            />
            <Column
              position="relative"
              textVariant="body-default-xs"
              onBackground="neutral-medium"
              alignItems="center"
              align="center"
              fillWidth
              gap="16"
            >
              <Logo wordmark={false} size="s" />
              <Text size="m">
                <Text onBackground="neutral-weak">2024 /</Text> Once UI
              </Text>
              <SmartLink
                href="https://github.com/josumaru/hianime-app?tab=MIT-1-ov-file"
                target="_blank"
              >
                MIT License
              </SmartLink>
            </Column>
          </Row>
        </Column>
      </Column>
    </Column>
  );
};

export default Home;
