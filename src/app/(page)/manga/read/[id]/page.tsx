"use client";
import { decrypt } from "@/lib/crypto";
import { getMangadexChapterImage } from "@/lib/mangadex";
import { useMangadexStore } from "@/lib/store";
import {
  Column,
  Flex,
  Scroller,
  SmartImage,
  Spinner,
  Text,
  useToast,
} from "@/once-ui/components";
import { NextPage } from "next";
import { use, useEffect, useState } from "react";

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
          direction="row"
          maxWidth={"l"}
          fillHeight
          background="brand-medium"
          border="brand-medium"
          overflow="scroll"
        >
          {chapterImage?.chapter.data.map((image, index) => (
            <img
              style={{ marginTop: index == 0 ? "65px" : "0px" }}
              key={image}
              alt={image}
              src={`${chapterImage.baseUrl}/data/${chapterImage.chapter.hash}/${image}`}
            />
          ))}
        </Scroller>
      )}
    </Flex>
  );
};

export default Page;
