"use client";
import { getPopular } from "@/lib/mangadex";
import { useMangadexStore } from "@/lib/store";
import {
  Column,
  Flex,
  LetterFx,
  Row,
  Spinner,
  Text,
  useToast,
} from "@/once-ui/components";
import { NextPage } from "next";
import { useEffect, useState } from "react";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const { popularManga, setPopularManga } = useMangadexStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (popularManga) return;
        const popularMangaResponse = await getPopular();
        setPopularManga(popularMangaResponse);
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
  return (
    <Flex fillHeight fillWidth justifyContent={"center"} alignItems={"center"}>
      {loading ? (
        <Spinner />
      ) : (
        <Column>
          {popularManga?.data.map((manga) => (
            <Text variant="code-default-l" key={manga.id}>
              <LetterFx speed="medium" trigger="instant">
                {manga.attributes.title.en}
              </LetterFx>
            </Text>
          ))}
        </Column>
      )}
    </Flex>
  );
};

export default Page;
