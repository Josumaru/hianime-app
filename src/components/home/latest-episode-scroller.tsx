import { encrypt } from "@/lib/crypto";
import {
  Column,
  Heading,
  LetterFx,
  Scroller,
  SmartImage,
  SmartLink,
  Text,
} from "@/once-ui/components";
import { Anime } from "@/types/hianime";
import { NextPage } from "next";
interface Props {
  params: Anime[];
}

const LatestEpisodeScroller: NextPage<Props> = ({ params }) => {
  return (
    <Column fillWidth marginTop="24">
      <Column paddingLeft="8">
        <Heading align="left" as="h2" variant="display-default-m">
          Latest Episode
        </Heading>
        <Text marginBottom="8" align="left" onBackground="neutral-weak">
          New episodes that are sure to get you excited
        </Text>
      </Column>
      <Scroller
        direction="row"
        alignItems="start"
        justifyContent="start"
        padding="0"
        opacity={70}
        border="accent-alpha-weak"
      >
        {params.map((episode) => (
          <SmartLink
            key={episode.id}
            href={`/anime/detail/${encrypt(episode.id)}`}
          >
            <Column fillHeight overflowX="hidden" maxWidth={12} hide="s">
              <SmartImage
                key={episode.id}
                aspectRatio="2/3"
                radius="l"
                fillWidth
                width={12}
                title={episode.title}
                src={episode.poster}
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
                  {episode.title}
                </LetterFx>
              </Text>
            </Column>
            <Column fillHeight overflowX="hidden" maxWidth={8} show="s">
              <SmartImage
                key={episode.id}
                aspectRatio="2/3"
                radius="l"
                fillWidth
                width={8}
                title={episode.title}
                src={episode.poster}
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
                  {episode.title}
                </LetterFx>
              </Text>
            </Column>
          </SmartLink>
        ))}
      </Scroller>
    </Column>
  );
};

export default LatestEpisodeScroller;
