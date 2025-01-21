import { encrypt } from "@/lib/crypto";
import { useMangadexStore } from "@/lib/store";
import {
  Column,
  Grid,
  Heading,
  Row,
  SmartImage,
  SmartLink,
  Tag,
  Text,
} from "@/once-ui/components";
import { NextPage } from "next";

interface Props {}

const LatestChapter: NextPage<Props> = ({}) => {
  const { latestUpdate } = useMangadexStore();
  const reverseProxy = process.env.NEXT_PUBLIC_REVERSE_PROXY;
  return (
    <Column>
      <Heading as="h2" marginTop="l" variant="display-default-m" align="right">
        Latest Chapter
      </Heading>
      <Text align="right" onBackground="neutral-weak">
        The latest chapters to keep you updated and entertained
      </Text>
      <Grid
        marginTop="8"
        gap="4"
        columns={4}
        mobileColumns={1}
        tabletColumns={3}
      >
        {latestUpdate?.data.map((manga) => (
          <Row
            key={manga.id}
            background="brand-medium"
            border="brand-medium"
            radius="m"
            paddingY="8"
            opacity={70}
          >
            <SmartLink href={`/manga/detail/${encrypt(manga.id)}`}>
              <SmartImage
                aspectRatio="9/16"
                radius="s"
                width={"128"}
                src={`${reverseProxy}https://uploads.mangadex.org/covers/${
                  manga.id
                }/${
                  manga.relationships.find(
                    (relationship) => relationship.type === "cover_art"
                  )?.attributes?.fileName
                }.256.jpg`}
              />
              <Column gap="xs" fillWidth>
                <Text
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    WebkitLineClamp: 1,
                  }}
                >
                  {manga.attributes.title.en}
                </Text>
                <Tag
                  label={manga.attributes.tags[0].attributes.name.en}
                  variant="danger"
                />
                <Row gap="xs">
                  {manga.relationships.find(
                    (relationship) => relationship.type === "cover_art"
                  )?.attributes?.volume && (
                    <Text variant="label-default-l">
                      Vol.{" "}
                      {
                        manga.relationships.find(
                          (relationship) => relationship.type === "cover_art"
                        )?.attributes?.volume
                      }
                    </Text>
                  )}
                  {manga.attributes.lastVolume && (
                    <Text variant="label-default-l">
                      Vol. {manga.attributes.lastVolume}
                    </Text>
                  )}
                </Row>
              </Column>
            </SmartLink>
          </Row>
        ))}
      </Grid>
    </Column>
  );
};

export default LatestChapter;
