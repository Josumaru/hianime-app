import { MangaCarousel } from "@/once-ui/components/MangaCarousel";
import { Data } from "@/types/manga/popular";
import { NextPage } from "next";

interface Props {
  params: Data[];
}

const PopularTitles: NextPage<Props> = ({ params }) => {
  return <MangaCarousel mangas={params} />;
};

export default PopularTitles;
