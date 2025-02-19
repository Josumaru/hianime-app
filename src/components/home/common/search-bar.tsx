"use client";
import { encrypt } from "@/lib/crypto";
import { getSearch } from "@/lib/hianime";
import { getMangadexSearch } from "@/lib/mangadex";
import {
  Button,
  Column,
  Dialog,
  Flex,
  Input,
  PasswordInput,
  SmartLink,
  Spinner,
  Tag,
  Text,
  User,
  useToast,
} from "@/once-ui/components";
import { MangadexManga } from "@/types/manga/popular";
import { Search } from "@/types/anime/search";
import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import { HiSearch } from "react-icons/hi";

interface Props {}

const SearchBar: NextPage<Props> = ({}) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<Search | null>(null);
  const [mangaData, setMangaData] = useState<MangadexManga | null>(null);
  const [keyword, setKeyword] = useState<string>("");
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();
  const reverseProxy = process.env.NEXT_PUBLIC_REVERSE_PROXY;
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [keyword]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (debouncedKeyword) {
          setLoading(true);
          const response = await getSearch(debouncedKeyword);
          const mangaResponse = await getMangadexSearch(debouncedKeyword);
          if (mangaResponse.data.length > 0) {
            setMangaData(mangaResponse);
            addToast({
              message: `Haha, I got the manga you were looking for ( ˶ˆᗜˆ˵ )`,
              variant: "success",
            });
          } else {
            addToast({
              message: `Wait a minute...( •̀ - • )?, are you sure you're looking for ${keyword} manga here?`,
              variant: "danger",
            });
            setData(null);
          }
          if (response.results.data.length != 0) {
            setData(response);
            addToast({
              message: `Haha, I got the anime you were looking for ( ◡̀_◡́)ᕤ`,
              variant: "success",
            });
          } else {
            addToast({
              message: `Wait a minute...( •̀ - • )?, are you sure you're looking for ${keyword} here?`,
              variant: "danger",
            });
            setData(null);
          }
        }
      } catch (error: any) {
        addToast({
          message: `No Anime found for ${keyword} ˙◠˙`,
          variant: "danger",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [debouncedKeyword]);

  useEffect(() => {
    if (open) {
      inputRef.current?.click();
    }
  }, [open]);
  return (
    <Flex>
      {/* <Flex show="s">
        <Tag
          variant="brand"
          cursor="pointer"
          label="Search ..."
          paddingRight="12"
          prefixIcon="search"
          textVariant="code-default-l"
          onClick={() => setOpen(true)}
        />
      </Flex> */}
      <Flex show="s">
        <Button
          variant="tertiary"
          onClick={() => setOpen(true)}
          style={{ padding: 2 }}
        >
          <Flex
            onClick={() => setOpen(true)}
            alignItems="center"
            gap="12"
            fillWidth
            justifyContent="space-between"
          >
            <Text
              onBackground="brand-medium"
              variant="body-default-l"
              paddingLeft="12"
            >
              Search ...
            </Text>
            <Tag variant="brand" size="l">
              <Flex>
                <HiSearch />
              </Flex>
            </Tag>
          </Flex>
        </Button>
      </Flex>
      <Flex hide="s">
        <Button
          variant="tertiary"
          onClick={() => setOpen(true)}
          style={{ padding: 2 }}
        >
          <Flex
            onClick={() => setOpen(true)}
            alignItems="center"
            gap="12"
            fillWidth
            justifyContent="space-between"
          >
            <Text
              onBackground="brand-medium"
              variant="body-default-l"
              paddingLeft="12"
            >
              Search ...
            </Text>
            <Tag variant="brand" size="l" label="⌘ + K" />
          </Flex>
        </Button>
      </Flex>

      <Dialog
        onClose={() => setOpen(false)}
        isOpen={open}
        title={"Gol D. Roger:"}
        description="My wealth and treasure? It can be yours if you want it! Search for it! I left everything in that one place. (っᵔ◡ᵔ)っ"
        footer={
          <Column
            maxHeight={"xs"}
            overflowY="scroll"
            fillWidth
            gap="8"
            alignItems="start"
            justifyContent="start"
            fillHeight
          >
            {loading ? (
              <Flex
                fillWidth
                fillHeight
                alignItems="center"
                justifyContent="center"
                padding="40"
              >
                <Spinner />
              </Flex>
            ) : data ? (
              <>
                {data?.results.data.map((result) => (
                  <SmartLink
                    href={`/anime/detail/${encrypt(result.id)}`}
                    key={result.id}
                    onClick={() => setOpen(false)}
                  >
                    <User
                      name={result.japanese_title}
                      subline={result.title}
                      tagProps={{
                        label: result.tvInfo.showType,
                        variant: "accent",
                      }}
                      avatarProps={{
                        src: result.poster,
                      }}
                    />
                  </SmartLink>
                ))}
                {mangaData?.data.map((result) => (
                  <SmartLink
                    href={`/manga/detail/${encrypt(result.id)}`}
                    key={result.id}
                    onClick={() => setOpen(false)}
                  >
                    <User
                      name={result.attributes.title.en}
                      subline={
                        result.attributes.altTitles.find((title) => title)?.[
                          "ja-ro"
                        ] ??
                        result.attributes.altTitles.find((title) => title)
                          ?.ja ??
                        result.attributes.altTitles.find((title) => title)?.en
                      }
                      tagProps={{
                        label:
                          result.type.charAt(0).toUpperCase() +
                          result.type.slice(1),
                        variant: "accent",
                      }}
                      avatarProps={{
                        src: `${reverseProxy}https://uploads.mangadex.org/covers/${
                          result.id
                        }/${
                          result.relationships.find(
                            (rel) => rel.type === "cover_art"
                          )?.attributes?.fileName
                        }.256.jpg`,
                      }}
                    />
                  </SmartLink>
                ))}
              </>
            ) : (
              <Flex
                fillWidth
                fillHeight
                alignItems="center"
                justifyContent="center"
                direction="column"
                padding="40"
              >
                <Text variant="body-strong-xl">404</Text>
                <Text
                  align="center"
                  variant="body-default-s"
                  onBackground="info-weak"
                >
                  It's sad that you failed to get what you were looking for, but
                  don't worry, it's not your fault. ૮(˶ㅠ︿ㅠ)ა
                </Text>
              </Flex>
            )}
          </Column>
        }
      >
        <Column paddingY="12" fillWidth>
          <Input
            ref={inputRef}
            id="password"
            autoFocus
            label="Anime title"
            onChange={(e) => setKeyword(e.target.value)}
          />
        </Column>
      </Dialog>
    </Flex>
  );
};

export default SearchBar;
