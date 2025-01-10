import { Carousel, useToast } from "@/once-ui/components";
import { Spotlight } from "@/types/hianime";
import { NextPage } from "next";

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
  return <Carousel aspectRatio="16 / 9" indicator="line" images={images} opacity={20} />;
};

export default SpotlightCarousel;
