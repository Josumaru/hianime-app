"use client";
import { encrypt } from "@/lib/crypto";
import { getSearch } from "@/lib/hianime";
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
import { Search } from "@/types/search";
import { NextPage } from "next";
import { InputHTMLAttributes, useEffect, useRef, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";

interface Props {}

const SearchBar: NextPage<Props> = ({}) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<Search | null>(null);
  const [keyword, setKeyword] = useState<string>("");
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

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
      <Flex show="s">
        <Tag
          variant="brand"
          cursor="pointer"
          label="Search anime..."
          prefixIcon="search"
          textVariant="code-default-l"
          onClick={() => setOpen(true)}
        />
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
            <Text variant="code-default-l">Search anime...</Text>
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
              data?.results.data.map((result) => (
                <SmartLink
                  href={`/anime/detail/${encrypt(result.id)}`}
                  key={result.id}
                  onClick={() => setOpen(false)}
                >
                  <User
                    name={
                      result.title.length > 50
                        ? `${result.title.substring(0, 50)}...`
                        : result.title
                    }
                    subline={
                      result.japanese_title.length > 80
                        ? `${result.japanese_title.substring(0, 80)}...`
                        : result.japanese_title
                    }
                    tagProps={{
                      label: result.tvInfo.showType,
                      variant: "accent",
                    }}
                    avatarProps={{
                      src: result.poster,
                    }}
                  />
                </SmartLink>
              ))
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
