import { encrypt } from "@/lib/crypto";
import {
  Column,
  LetterFx,
  Scroller,
  SmartImage,
  SmartLink,
  Text,
} from "@/once-ui/components";
import { Trending } from "@/types/hianime";
import { NextPage } from "next";

interface Props {
  params: Trending[];
}

const TrendingScroller: NextPage<Props> = ({ params }) => {
  return (
    <Scroller
      direction="row"
      alignItems="start"
      justifyContent="start"
      padding="0"
      opacity={70}
    >
      {params.map((episode) => (
        <SmartLink key={episode.id} href={`/anime/detail/${encrypt(episode.id)}`}>
          <Column fillHeight overflowX="hidden" maxWidth={12}>
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
        </SmartLink>
      ))}
    </Scroller>
  );
};

export default TrendingScroller;
