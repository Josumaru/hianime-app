import { encrypt } from "@/lib/crypto";
import { useMangadexStore } from "@/lib/store";
import {
  Column,
  Heading,
  LetterFx,
  Scroller,
  SmartImage,
  SmartLink,
  Text,
} from "@/once-ui/components";
import { MangadexManga } from "@/types/manga/popular";
import { NextPage } from "next";

interface Props {
  manga: MangadexManga | null;
  left?: boolean;
  title: string;
  subtitle: string;
}

const UserIncludesManga: NextPage<Props> = ({
  manga,
  left = false,
  title,
  subtitle,
}) => {
  const reverseProxy = process.env.NEXT_PUBLIC_REVERSE_PROXY;

  return (
    <Column>
      <Heading
        as="h2"
        marginTop="24"
        variant="display-default-m"
        align={left ? "left" : "right"}
      >
        {title}
      </Heading>
      <Text
        align={left ? "left" : "right"}
        marginBottom="8"
        onBackground="neutral-weak"
      >
        {subtitle}
      </Text>
      <Scroller
        direction="row"
        alignItems="start"
        justifyContent="start"
        padding="0"
        opacity={70}
        marginTop="0"
        border="accent-alpha-weak"
      >
        {manga?.data.map((manga) => (
          <SmartLink key={manga.id} href={`/anime/detail/${encrypt(manga.id)}`}>
            <Column fillHeight overflowX="hidden" maxWidth={12} hide="s">
              <SmartImage
                key={manga.id}
                aspectRatio="2/3"
                radius="l"
                fillWidth
                width={12}
                title={manga.attributes.title.en}
                src={`${reverseProxy}https://uploads.mangadex.org/covers/${
                  manga.id
                }/${
                  manga.relationships.find(
                    (relationship) => relationship.type === "cover_art"
                  )?.attributes?.fileName
                }.256.jpg`}
              />
              <Text
                style={{
                  fontFamily: "var(--font-family-code)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  lineClamp: 1,
                  maxLines: 1,
                  maxWidth: "100%",
                }}
                wrap="nowrap"
              >
                <LetterFx
                  speed="medium"
                  trigger="instant"
                  charset={[
                    "X",
                    "@",
                    "$",
                    "a",
                    "H",
                    "z",
                    "o",
                    "0",
                    "y",
                    "#",
                    "?",
                    "*",
                    "0",
                    "1",
                    "+",
                  ]}
                >
                  {manga.attributes.title.en}
                </LetterFx>
              </Text>
            </Column>
            <Column fillHeight overflowX="hidden" maxWidth={8} show="s">
              <SmartImage
                key={manga.id}
                aspectRatio="2/3"
                radius="l"
                fillWidth
                width={8}
                title={manga.attributes.title.en}
                src={`${reverseProxy}https://uploads.mangadex.org/covers/${
                  manga.id
                }/${
                  manga.relationships.find(
                    (relationship) => relationship.type === "cover_art"
                  )?.attributes?.fileName
                }.256.jpg`}
              />
              <Text
                variant="code-default-s"
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  lineClamp: 1,
                  maxLines: 1,
                  maxWidth: "100%",
                }}
                wrap="nowrap"
              >
                <LetterFx
                  speed="medium"
                  trigger="instant"
                  charset={[
                    "X",
                    "@",
                    "$",
                    "a",
                    "H",
                    "z",
                    "o",
                    "0",
                    "y",
                    "#",
                    "?",
                    "*",
                    "0",
                    "1",
                    "+",
                  ]}
                >
                  {manga.attributes.title.en}
                </LetterFx>
              </Text>
            </Column>
          </SmartLink>
        ))}
      </Scroller>
    </Column>
  );
};

export default UserIncludesManga;
