import { MangaCarousel } from "@/once-ui/components/MangaCarousel";
import { Data } from "@/types/manga/popular";
import { NextPage } from "next";
import { Fragment } from "react";

interface Props {
  params: Data[];
}

const PopularTitles: NextPage<Props> = ({ params }) => {
  return <Fragment>
    <MangaCarousel mangas={params} hide="s" aspectRatio="16/7"/>
    <MangaCarousel mangas={params} show="s" aspectRatio="16/9"/>
  </Fragment>;
};

export default PopularTitles;
