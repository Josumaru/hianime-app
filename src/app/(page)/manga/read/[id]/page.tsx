"use client";
import { decrypt, encrypt } from "@/lib/crypto";
import {
  getMangadexChapterImage,
  getMangadexDetail,
  getMangadexFeed,
} from "@/lib/mangadex";
import { useMangadexStore } from "@/lib/store";
import {
  Button,
  Column,
  Dialog,
  Fade,
  Flex,
  Icon,
  Row,
  Scroller,
  SmartLink,
  Spinner,
  Tag,
  Text,
  useToast,
} from "@/once-ui/components";
import { NextPage } from "next";
import { use, useEffect, useState } from "react";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.min.css";
import InnerImageZoom from "react-inner-image-zoom";
import { Feed } from "@/types/manga/feed";
import ChapterList from "@/components/manga/chapter-list";
import Link from "next/link";
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
  const { addToast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [currentChapter, setCurrentChapter] = useState<Feed | null>(null);
  const [currentTargetChapter, setCurrentTargetChapter] = useState<
    Feed[] | null
  >(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [openPrev, setOpenPrev] = useState<boolean>(true);
  const [openAll, setOpenAll] = useState<boolean>(false);

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

  return (
    <Flex fillHeight fillWidth justifyContent="center" alignItems="center">
      {loading ? (
        <Spinner />
      ) : (
        <Flex fillHeight fillWidth>
          <Scroller
            direction="column"
            maxWidth={"l"}
            fillWidth
            fillHeight
            style={{
              zIndex: 11,
            }}
          >
            {chapterImage?.chapter.data.map((image, index) => (
              <Flex
                fillWidth
                key={index}
                justifyContent="center"
                paddingTop={index == 0 ? "64" : "0"}
                paddingBottom={
                  index + 1 == chapterImage.chapter.data.length ? "104" : "0"
                }
              >
                <InnerImageZoom
                  key={index}
                  hideHint
                  zoomType="click"
                  src={`${chapterImage.baseUrl}/data/${chapterImage.chapter.hash}/${image}`}
                  zoomScale={2}
                  width={1920}
                />
              </Flex>
            ))}
          </Scroller>
          <Flex
            style={{
              zIndex: 12,
            }}
            height={"104"}
            position="fixed"
            zIndex={9}
            bottom="0"
            fillWidth
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
                <Icon
                  name="chevronLeft"
                  size="m"
                  onBackground="neutral-medium"
                />
                <Text variant="body-default-m">Previous</Text>
              </Row>
              <Column
                cursor="pointer"
                onClick={() => {
                  setOpenAll(true);
                  setCurrentTargetChapter(feedManga?.data ?? []);
                }}
              >
                <Text>
                  Chapter {currentChapter?.attributes.chapter ?? "Unavailable"}
                </Text>
                <Text onBackground="info-medium">
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
        </Flex>
      )}
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={`Chapter ${
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
                  <Text variant="body-default-l" onBackground="brand-medium">
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
    </Flex>
  );
};

export default Page;
