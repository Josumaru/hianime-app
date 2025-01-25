"use client";
import { decrypt, encrypt } from "@/lib/crypto";
import {
  getMangadexChapterImage,
  getMangadexDetail,
  getMangadexFeed,
} from "@/lib/mangadex";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./styles.module.css";
import { useMangadexStore, useSettingStore } from "@/lib/store";
import {
  Button,
  Column,
  Dialog,
  Flex,
  Heading,
  Icon,
  RadioButton,
  Row,
  Scroller,
  Spinner,
  Switch,
  Text,
  useToast,
} from "@/once-ui/components";
import { NextPage } from "next";
import { Fragment, use, useEffect, useState } from "react";
import { Feed } from "@/types/manga/feed";
import ChapterList from "@/components/manga/chapter-list";
import { MangaPreferences } from "@/types/manga/manga-preferences";
import { createCookies, getCookies } from "@/action/cookies-action";
import { SpacingToken } from "@/once-ui/types";

interface Props {
  params: Promise<{
    id: string;
  }>;
}
const Page: NextPage<Props> = ({ params }) => {
  const [mid, cid] = decrypt(use(params).id).split("(-|-)");
  const {
    chapterImage,
    setChapterImage,
    detailManga,
    setDetailManga,
    feedManga,
    setFeedManga,
  } = useMangadexStore();

  const { isOpenSetting, setIsOpenSetting } = useSettingStore();
  const { addToast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [currentChapter, setCurrentChapter] = useState<Feed | null>(null);
  const [currentTargetChapter, setCurrentTargetChapter] = useState<
    Feed[] | null
  >(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [openPrev, setOpenPrev] = useState<boolean>(true);
  const [openAll, setOpenAll] = useState<boolean>(false);
  const reverseProxy = process.env.NEXT_PUBLIC_REVERSE_PROXY;
  const [preferences, setPreferences] = useState<MangaPreferences>({
    orientation: "vertical",
    gap: 32,
    autoPlay: false,
    invertColors: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getMangadexChapterImage(cid);
        setChapterImage(response);
        const feedResponse = await getMangadexFeed(mid);
        feedResponse.data.find((feed, index) => {
          if (feed.id === cid) {
            setCurrentChapter(feed);
            setCurrentIndex(index);
            return true;
          }
        });
        setFeedManga(feedResponse);
        if (!detailManga) {
          const detailResponse = await getMangadexDetail(mid);
          setDetailManga(detailResponse);
        }
        const settings = (await getCookies(
          "_animanga_m_s"
        )) as MangaPreferences;
        if (settings) {
          setPreferences(settings);
        }
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

  useEffect(() => {
    let targetChapter = "";
    const target = feedManga?.data.slice(
      openPrev ? 0 : currentIndex,
      openPrev ? currentIndex : undefined
    );
    if (openPrev) {
      target?.map((feed) => {
        if (feed.attributes.chapter != currentChapter?.attributes.chapter) {
          targetChapter = feed.attributes.chapter;
        }
      });
    } else {
      target?.reverse().map((feed) => {
        if (feed.attributes.chapter != currentChapter?.attributes.chapter) {
          targetChapter = feed.attributes.chapter;
        }
      });
    }
    if (isOpen) {
      const result = target?.filter(
        (feed) => feed.attributes.chapter === targetChapter
      );
      setCurrentTargetChapter(result ?? []);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpenSetting) {
      const saveUserSettings = async (settings: object) => {
        await createCookies("_animanga_m_s", settings);
      };
      saveUserSettings(preferences);
    }
  }, [preferences]);

  return (
    <Flex fillHeight fillWidth justifyContent="center" alignItems="center">
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          {preferences.orientation === "vertical" && (
            <Flex
              fillHeight
              fillWidth
              direction={"column"}
              maxWidth={"l"}
              zIndex={1}
            >
              {chapterImage?.chapter.data.map((image, index) => (
                <Flex
                  fillWidth
                  key={index}
                  justifyContent="center"
                  marginTop={index == 0 ? "64" : "0"}
                  paddingBottom={
                    index + 1 == chapterImage.chapter.data.length
                      ? "64"
                      : (preferences.gap as unknown as SpacingToken)
                  }
                >
                  <img
                    alt={`Image-${index}`}
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "auto",
                      filter: preferences.invertColors
                        ? "invert(1)"
                        : "invert(0)",
                    }}
                    src={`${reverseProxy}${chapterImage.baseUrl}/data/${chapterImage.chapter.hash}/${image}`}
                  />
                </Flex>
              ))}
            </Flex>
          )}
          {preferences.orientation != "vertical" && (
            <Flex
              maxWidth={"l"}
              background="danger-medium"
              alignItems="center"
              marginBottom="64"
              fillHeight
            >
              <Swiper className="mySwiper">
                {chapterImage?.chapter.data.map((image, index) => (
                  <img
                    key={index}
                    alt={`Image-${index}`}
                    style={{
                      filter: preferences.invertColors
                        ? "invert(1)"
                        : "invert(0)",
                    }}
                    src={`${reverseProxy}${chapterImage.baseUrl}/data/${chapterImage.chapter.hash}/${image}`}
                  />
                ))}
              </Swiper>
            </Flex>
          )}
        </Fragment>
      )}
      {!loading && (
        <Flex
          height={"64"}
          position="fixed"
          bottom="0"
          fillWidth
          zIndex={1}
          maxWidth={"l"}
        >
          <Row
            background="brand-weak"
            fillWidth
            fillHeight
            justifyContent="space-between"
            alignItems="center"
          >
            <Row
              alignItems="center"
              paddingX="s"
              padding="12"
              radius="m"
              cursor="pointer"
              onClick={() => {
                setIsOpen(true);
                setOpenPrev(true);
              }}
            >
              <Icon name="chevronLeft" size="m" onBackground="neutral-medium" />
              <Text variant="body-default-m">Prev</Text>
            </Row>
            <Column
              cursor="pointer"
              alignItems="center"
              justifyContent="center"
              onClick={() => {
                setOpenAll(true);
                setCurrentTargetChapter(feedManga?.data ?? []);
              }}
            >
              <Text>
                Ch. {currentChapter?.attributes.chapter ?? "Unavailable"}
              </Text>
              <Text onBackground="info-weak" align="center">
                {currentChapter?.attributes.title}
              </Text>
            </Column>
            <Row
              alignItems="center"
              paddingX="s"
              padding="12"
              radius="m"
              cursor="pointer"
              onClick={() => {
                setIsOpen(true);
                setOpenPrev(false);
              }}
            >
              <Text variant="body-default-m">Next</Text>
              <Icon
                name="chevronRight"
                size="m"
                onBackground="neutral-medium"
              />
            </Row>
          </Row>
        </Flex>
      )}
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={`Ch. ${
          currentTargetChapter?.find((feed) => true)?.attributes.chapter
        }`}
        description="Choose the language you want... ( ˶ˆᗜˆ˵ )"
      >
        <Column paddingY="12" fillWidth gap="4">
          {currentTargetChapter?.map((feed, index) => {
            return (
              <Button
                variant="tertiary"
                fillWidth
                key={index}
                href={`/manga/read/${encrypt(
                  `${detailManga?.data.id}(-|-)${feed.id}`
                )}`}
              >
                <Row gap="4" fillWidth>
                  <Text variant="body-default-m" onBackground="brand-medium">
                    {feed.attributes.translatedLanguage.toUpperCase()}
                  </Text>
                </Row>
              </Button>
            );
          })}
        </Column>
      </Dialog>
      <Dialog
        isOpen={openAll}
        onClose={() => setOpenAll(false)}
        title={`Choose Chapter`}
        description="Choose the chapter you want... ( ˶ˆᗜˆ˵ )"
      >
        <ChapterList />
      </Dialog>
      <Dialog
        isOpen={isOpenSetting ?? false}
        onClose={() => setIsOpenSetting(false)}
        title="Customize your preferences"
        description="Use the settings below to enhance your manga reading experience... ( > ᴗ < )"
      >
        <Column gap="16">
          <Column>
            <Heading variant="heading-strong-l">Horizontal Orientation</Heading>
            <Row justifyContent="space-between">
              <RadioButton
                label="Vertical"
                description="Stack items top to bottom."
                isChecked={preferences.orientation === "vertical"}
                onToggle={() =>
                  setPreferences({ ...preferences, orientation: "vertical" })
                }
              />
              <RadioButton
                label="Horizontal"
                description="Align items side by side."
                isChecked={preferences.orientation === "horizontal"}
                onToggle={() =>
                  setPreferences({ ...preferences, orientation: "horizontal" })
                }
              />
            </Row>
          </Column>
          <Column>
            <Heading variant="heading-strong-l">Gap</Heading>
            <Row justifyContent="space-between">
              {[0, 16, 32].map((gap) => (
                <RadioButton
                  key={gap}
                  label={`${gap}`}
                  description={`Gap size: ${gap}`}
                  isChecked={preferences.gap === gap}
                  onToggle={() => setPreferences({ ...preferences, gap })}
                />
              ))}
            </Row>
          </Column>
          <Column>
            <Heading variant="heading-strong-l">Auto-Play Settings</Heading>
            <Switch
              isChecked={preferences.autoPlay}
              label="Enable Auto-Play"
              description="Automatically play through manga pages for a seamless reading experience."
              onToggle={() =>
                setPreferences({
                  ...preferences,
                  autoPlay: !preferences.autoPlay,
                })
              }
            />
          </Column>
          <Column>
            <Heading variant="heading-strong-l">Invert Colors</Heading>
            <Switch
              isChecked={preferences.invertColors}
              label="Enable Invert Colors"
              description="Flip the colors of the manga for a unique viewing experience."
              onToggle={() =>
                setPreferences({
                  ...preferences,
                  invertColors: !preferences.invertColors,
                })
              }
            />
          </Column>
        </Column>
      </Dialog>
    </Flex>
  );
};

export default Page;
