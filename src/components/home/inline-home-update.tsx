import { useHianimeStore } from "@/lib/store";
import { InlineCode, SmartLink, Text } from "@/once-ui/components";
import { NextPage } from "next";
import { Fragment } from "react";

interface Props {}

const InlineHomeUpdate: NextPage<Props> = ({}) => {
  const { hianime } = useHianimeStore();
  if (!hianime) return null;
  return (
    <Fragment>
      <InlineCode
        radius="xl"
        shadow="m"
        fit
        paddingX="16"
        paddingY="8"
        hide="s"
      >
        Start by watching
        <SmartLink
          href={`/${hianime?.results.latestEpisode[0].id}`}
          target="_blank"
        >
          <Text
            onBackground="brand-medium"
            marginLeft="8"
            style={{ cursor: "pointer" }}
          >
            {hianime?.results.latestEpisode[0].japanese_title}
          </Text>
        </SmartLink>
      </InlineCode>
      <InlineCode
        radius="xl"
        shadow="m"
        fit
        paddingX="16"
        paddingY="8"
        show="s"
      >
        Start by watching
        <SmartLink
          href={`/${hianime?.results.latestEpisode[0].id}`}
          target="_blank"
        >
          <Text
            onBackground="brand-medium"
            marginLeft="8"
            style={{ cursor: "pointer" }}
          >
            {hianime.results.latestEpisode[0].japanese_title.length > 10
              ? `${hianime.results.latestEpisode[0].japanese_title.substring(
                  0,
                  10
                )}...`
              : hianime.results.latestEpisode[0].japanese_title}
          </Text>
        </SmartLink>
      </InlineCode>
    </Fragment>
  );
};

export default InlineHomeUpdate;
