"use client";
import { decrypt } from "@/lib/crypto";
import {
  getMangadexChapterImage,
  getMangadexDetail,
  getMangadexFeed,
} from "@/lib/mangadex";
import { useMangadexStore } from "@/lib/store";
import {
  Button,
  Fade,
  Flex,
  Icon,
  Row,
  Scroller,
  Spinner,
  Text,
  useToast,
} from "@/once-ui/components";
import { NextPage } from "next";
import { use, useEffect, useState } from "react";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.min.css";
import InnerImageZoom from "react-inner-image-zoom";
interface Props {
  params: Promise<{
    id: string;
  }>;
}
const Page: NextPage<Props> = ({ params }) => {
  const id = decrypt(use(params).id);
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
  const [currentChapter, setCurrentChapter] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!chapterImage) {
          const response = await getMangadexChapterImage(id);
          setChapterImage(response);
        }
        if (!feedManga) {
          const feedResponse = await getMangadexFeed(id);
          feedResponse.data.find((feed) => {
            if (feed.id === id) {
              setCurrentChapter(feed.attributes.chapter);
              return true;
            }
          });
          setFeedManga(feedResponse);
        }
        if (!detailManga) {
          const detailResponse = await getMangadexDetail(id);
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
  }, [id]);
  return (
    <Flex fillHeight fillWidth justifyContent="center" alignItems="center">
      {loading ? (
        <Spinner />
      ) : (
        // <Flex fillHeight>
          <Scroller
            direction="column"
            maxWidth={"l"}
            fillWidth
            fillHeight
            background="brand-medium"
            style={{
              zIndex: 11,
            }}
            border="brand-medium"
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
                  src={`${chapterImage.baseUrl}/data/${chapterImage.chapter.hash}/${image}`}
                  zoomScale={2}
                  width={1920}
                />
              </Flex>
            ))}
          </Scroller>
        //   <Flex
        //     style={{
        //       zIndex: 12,
        //     }}
        //     height={"104"}
        //     position="fixed"
        //     zIndex={9}
        //     bottom="0"
        //     fillWidth
        //     maxWidth={"l"}
        //   >
        //     <Row
        //       background="brand-weak"
        //       fillWidth
        //       fillHeight
        //       justifyContent="space-between"
        //       alignItems="center"
        //     >
        //       <Row
        //         alignItems="center"
        //         paddingX="s"
        //         padding="12"
        //         radius="m"
        //         cursor="pointer"
        //         onClick={() => {}}
        //       >
        //         <Icon
        //           name="chevronLeft"
        //           size="m"
        //           onBackground="neutral-medium"
        //         />
        //         <Text variant="body-default-m">Previous</Text>
        //       </Row>
        //       <Text>{currentChapter}</Text>
        //       <Row
        //         alignItems="center"
        //         paddingX="s"
        //         padding="12"
        //         radius="m"
        //         cursor="pointer"
        //         onClick={() => {}}
        //       >
        //         <Text variant="body-default-m">Next</Text>
        //         <Icon
        //           name="chevronRight"
        //           size="m"
        //           onBackground="neutral-medium"
        //         />
        //       </Row>
        //     </Row>
        //   </Flex>
        // </Flex>
      )}
    </Flex>
  );
};

export default Page;
