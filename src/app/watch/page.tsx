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
import { Flex, Spinner, useToast } from "@/once-ui/components";
import { getStream } from "@/lib/hianime";
interface Props {}

const Page: NextPage<Props> = ({}) => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [data, setData] = useState<Stream | null>(null);
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
        if (response.results.streamingLink.link) {
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

  return (
    <Suspense
      fallback={
        <Flex justifyContent="center" fillWidth fillHeight>
          <Spinner />
        </Flex>
      }
    >
      {loading ? (
        <Flex justifyContent="center" fillWidth fillHeight>
          <Spinner />
        </Flex>
      ) : (
        <MediaPlayer
          title="Sprite Fight"
          src={data?.results.streamingLink.link.file}
        >
          <MediaProvider>
            {data?.results.streamingLink.tracks.map((track, index) => (
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
      )}
      ;
    </Suspense>
  );
};

export default Page;
