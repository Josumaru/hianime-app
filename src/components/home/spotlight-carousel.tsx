import { useToast } from "@/once-ui/components";
import { AnimeCarousel } from "@/once-ui/components/AnimeCarousel";
import { Spotlight } from "@/types/anime/hianime";
import { NextPage } from "next";
import { Fragment } from "react";

interface Props {
  params: Spotlight[];
}
interface Image {
  src: string;
  alt: string;
}
const SpotlightCarousel: NextPage<Props> = ({ params }) => {
  const { addToast } = useToast();

  let images: Image[] = [];
  try {
    params.forEach((spotlight) => {
      images.push({
        alt: spotlight.title,
        src: spotlight.poster,
      });
    });
  } catch (error) {
    addToast({
      message: error as unknown as string,
      variant: "danger",
    });
  }
  return (
    <Fragment>
      <AnimeCarousel
        aspectRatio="16 / 9"
        indicator="line"
        spotlight={params}
        opacity={70}
        show="s"
      />
      <AnimeCarousel
        aspectRatio="16 / 7"
        indicator="line"
        spotlight={params}
        opacity={70}
        hide="s"
      />
    </Fragment>
  );
};

export default SpotlightCarousel;
