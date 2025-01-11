"use client";
import { NextPage } from "next";
import { useSearchParams } from "next/navigation";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { MediaPlayer, MediaProvider, Poster, Track } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import { Suspense, useEffect, useState } from "react";
import { Stream } from "@/types/stream";
import { Button, Column, Flex, Row, Spinner, useToast } from "@/once-ui/components";
import { getStream } from "@/lib/hianime";
import { Servers } from "@/types/servers";
interface Props {}

interface StreamProps {
  stream: Stream;
  servers: Servers;
}

const VideoPlayer = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [data, setData] = useState<StreamProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!id) {
          throw new Error("Hmm, miss something???");
        }
        const response = await getStream(id);
        if (response.stream.results.streamingLink.link) {
          setData(response);
          addToast({
            message: "Yeay, enjoy your anime... ( ˶ˆᗜˆ˵ )",
            variant: "success",
          });
        } else {
          throw new Error("Hmm...");
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
  }, []);

  return loading ? (
    <Flex justifyContent="center" fillWidth fillHeight>
      <Spinner />
    </Flex>
  ) : (
    <Row>
      <Column>
        <MediaPlayer src={data?.stream.results.streamingLink.link.file}>
          <MediaProvider>
            {data?.stream.results.streamingLink.tracks.map((track, index) => (
              <Track
                key={`${index}`}
                src={track.file}
                kind={track.kind as TextTrackKind}
                label={track.label}
                default={track.label === "English"}
              />
            ))}
          </MediaProvider>
          <DefaultVideoLayout icons={defaultLayoutIcons} />
        </MediaPlayer>
        {data?.servers.results.map((server) => <Button key={server.data_id} label={server.serverName}/>)}
      </Column>
    </Row>
  );
};

const Page: NextPage = ({}) => {
  return (
    <Suspense>
      <VideoPlayer />
    </Suspense>
  );
};

export default Page;
