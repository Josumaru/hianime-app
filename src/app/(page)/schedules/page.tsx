"use client";
import { Column } from "@/once-ui/components";
import { NextPage } from "next";
import HomeBackground from "@/components/home/home-background";
import AnimeSchedule from "@/components/home/anime-schedule";

const Home: NextPage = () => {
  return (
    <Column fillWidth paddingY="80" paddingX="s" alignItems="center" flex={1}>
      <HomeBackground />
      <Column
        overflow="hidden"
        as="main"
        maxWidth="l"
        position="relative"
        radius="xl"
        alignItems="start"
        border="neutral-alpha-weak"
        fillWidth
        paddingBottom="8"
      >
        <AnimeSchedule />
      </Column>
    </Column>
  );
};

export default Home;
