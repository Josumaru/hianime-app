import { Background } from "@/once-ui/components";
import { NextPage } from "next";
import { Fragment } from "react";

interface Props {}

const MangaBackground: NextPage<Props> = ({}) => {
  return (
    <Fragment>
      <Background
        mask={{
          x: 0,
          y: 100,
        }}
        position="fixed"
        grid={{
          display: true,
          width: "0.25rem",
          color: "neutral-alpha-medium",
          height: "0.25rem",
        }}
      />
      <Background
        mask={{
          x: 100,
          y: 100,
          radius: 100,
        }}
        position="fixed"
        gradient={{
          display: true,
          tilt: -35,
          height: 50,
          width: 75,
          x: 100,
          y: 40,
          colorStart: "accent-solid-medium",
          colorEnd: "static-transparent",
        }}
      />
      <Background
        position="fixed"
        mask={{
          cursor: true,
        }}
        gradient={{
          colorEnd: "static-transparent",
          colorStart: "accent-solid-strong",
          display: true,
          height: 100,
          opacity: 100,
          tilt: 0,
          width: 150,
          x: 0,
          y: 0,
        }}
        dots={{
          color: "accent-on-background-medium",
          display: true,
          opacity: 100,
          size: "64",
        }}
        grid={{
          color: "neutral-alpha-medium",
          display: true,
          height: "var(--static-space-32)",
          opacity: 100,
          width: "var(--static-space-32)",
        }}
        lines={{
          display: false,
          opacity: 100,
          size: "24",
        }}
      />
    </Fragment>
  );
};

export default MangaBackground;
