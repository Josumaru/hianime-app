"use client";
import { decrypt } from "@/lib/crypto";
import { getMangadexChapterImage } from "@/lib/mangadex";
import { useMangadexStore } from "@/lib/store";
import { Flex, Scroller, Spinner, useToast } from "@/once-ui/components";
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
  const id = use(params).id;
  const { chapterImage, setChapterImage } = useMangadexStore();
  const { addToast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!chapterImage) {
          const response = await getMangadexChapterImage(decrypt(id));
          setChapterImage(response);
        } else {
          throw new Error(
            "Impossible, this failure has never happened ૮(˶ㅠ︿ㅠ)ა"
          );
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
        <Scroller
          direction="column"
          maxWidth={"l"}
          fillHeight
          background="brand-medium"
          border="brand-medium"
        >
          {chapterImage?.chapter.data.map((image, index) => (
            <Flex
              fillWidth
              justifyContent="center"
              paddingTop={index == 0 ? "64" : "0"}
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
      )}
    </Flex>
  );
};

export default Page;
