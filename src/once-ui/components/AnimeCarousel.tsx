"use client";

import { encrypt } from "@/lib/crypto";
import {
  Badge,
  Column,
  Flex,
  Heading,
  LetterFx,
  RevealFx,
  Row,
  Scroller,
  SmartImage,
  SmartLink,
  Tag,
  Text,
} from "@/once-ui/components";
import { Spotlight } from "@/types/anime/hianime";
import { useEffect, useState, useRef } from "react";
import { IoPlayCircleOutline, IoPlayOutline } from "react-icons/io5";
import { PiPlayCircleDuotone } from "react-icons/pi";

interface Image {
  src: string;
  alt: string;
}

interface AnimeCarouselProps extends React.ComponentProps<typeof Flex> {
  spotlight: Spotlight[];
  indicator?: "line" | "thumbnail";
  aspectRatio?: string;
  sizes?: string;
  revealedByDefault?: boolean;
}

const AnimeCarousel: React.FC<AnimeCarouselProps> = ({
  spotlight = [],
  indicator = "line",
  aspectRatio = "16 / 9",
  sizes,
  revealedByDefault = false,
  ...rest
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState(revealedByDefault);
  const [initialTransition, setInitialTransition] = useState(revealedByDefault);
  const nextImageRef = useRef<HTMLImageElement | null>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const preloadNextImage = (nextIndex: number) => {
    if (nextIndex >= 0 && nextIndex < spotlight.length) {
      nextImageRef.current = new Image();
      nextImageRef.current.src = spotlight[nextIndex].poster;
    }
  };

  const handleImageClick = () => {
    if (spotlight.length > 1) {
      const nextIndex = (activeIndex + 1) % spotlight.length;
      handleControlClick(nextIndex);
    }
  };

  const handleControlClick = (nextIndex: number) => {
    if (nextIndex !== activeIndex && !transitionTimeoutRef.current) {
      preloadNextImage(nextIndex);

      setIsTransitioning(false);

      transitionTimeoutRef.current = setTimeout(() => {
        setActiveIndex(nextIndex);

        setTimeout(() => {
          setIsTransitioning(true);
          transitionTimeoutRef.current = undefined;
        }, 300);
      }, 800);
    }
  };

  useEffect(() => {
    if (!revealedByDefault && !initialTransition) {
      setIsTransitioning(true);
      setInitialTransition(true);
    }
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [revealedByDefault, initialTransition]);

  if (spotlight.length === 0) {
    return null;
  }

  return (
    <Flex fillWidth gap="12" direction="column" {...rest}>
      <RevealFx
        onClick={handleImageClick}
        fillWidth
        aspectRatio={aspectRatio}
        trigger={isTransitioning}
        translateY="16"
        speed="fast"
        radius="l"
      >
        <SmartImage
          sizes={sizes}
          priority
          radius="xl"
          overflow="hidden"
          alt={spotlight[activeIndex]?.title}
          aspectRatio={aspectRatio}
          src={spotlight[activeIndex]?.poster}
          style={{
            // transform: "translateX(10%)",
            border: "1px solid var(--neutral-alpha-weak)",
            ...(spotlight.length > 1 && {
              cursor: "pointer",
            }),
          }}
        />
        <Flex
          fillHeight
          fillWidth
          position="absolute"
          background="brand-medium"
          opacity={90}
          style={{
            transition: "background 0.5s ease-in-out",
            background: `linear-gradient(90deg, var(--brand-background-strong) 50%, transparent 100%)`,
          }}
        />
        <Column padding="l" position="absolute" bottom="0" fillWidth hide="s">
          <Heading
            variant="display-default-m"
            style={{
              width: "50%",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              WebkitLineClamp: 2,
            }}
          >
            <LetterFx trigger="instant" speed="medium">
              {spotlight[activeIndex].japanese_title}
            </LetterFx>
          </Heading>
          <Row gap={"12"} paddingY="8">
            {[
              spotlight[activeIndex].tvInfo.showType,
              spotlight[activeIndex].tvInfo.duration,
              spotlight[activeIndex].tvInfo.releaseDate,
            ].map((info) => (
              <Tag key={info} variant="accent" size="m" label={info} />
            ))}
          </Row>
          <Text variant="body-default-l" align="justify">
            <RevealFx
              speed="medium"
              style={{
                width: "50%",
                maskImage: `linear-gradient(to top, transparent, #ffffff 100%)`,
                WebkitMaskImage: `linear-gradient(to top, transparent, #ffffff 100%)`,
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                WebkitLineClamp: 6,
              }}
            >
              {spotlight[activeIndex].description}
            </RevealFx>
          </Text>
        </Column>
        <Flex>
          <Flex
            style={{ width: "50%" }}
            position="absolute"
            right="0"
            fillHeight
            justifyContent="center"
          >
            <SmartLink
              href={`/anime/detail/${encrypt(spotlight[activeIndex].id)}`}
            >
              <Tag
                variant="brand"
                margin="0"
                radius="full"
                aspectRatio={1}
                padding="xl"
              >
                <Flex
                  fillWidth
                  justifyContent="center"
                  alignItems="center"
                  paddingLeft="2"
                  show="s"
                >
                  <IoPlayOutline size={"20"} />
                </Flex>
                <Flex
                  hide="s"
                  fillWidth
                  justifyContent="center"
                  alignItems="center"
                  paddingLeft="8"
                >
                  <IoPlayOutline size={"50"} />
                </Flex>
              </Tag>
            </SmartLink>
          </Flex>
        </Flex>
        <Column padding="s" position="absolute" bottom="0" fillWidth show="s">
          <Text
            variant="display-default-xs"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              WebkitLineClamp: 2,
              width: "60%",
            }}
          >
            <LetterFx trigger="instant" speed="medium">
              {spotlight[activeIndex].japanese_title}
            </LetterFx>
          </Text>
          {/* <Row gap={"8"} paddingY="8">
            {[
              spotlight[activeIndex].tvInfo.showType,
              spotlight[activeIndex].tvInfo.releaseDate,
            ].map((info) => (
              <Tag key={info} variant="brand" size="m" label={info} />
            ))}
          </Row> */}
        </Column>
      </RevealFx>
      {spotlight.length > 1 && (
        <>
          {indicator === "line" ? (
            <Flex gap="4" paddingX="s" fillWidth justifyContent="center">
              {spotlight.map((_, index) => (
                <Flex
                  key={index}
                  onClick={() => handleControlClick(index)}
                  style={{
                    background:
                      activeIndex === index
                        ? "var(--neutral-on-background-strong)"
                        : "var(--neutral-alpha-medium)",
                    cursor: "pointer",
                    transition: "background 0.3s ease",
                  }}
                  fillWidth
                  height="2"
                ></Flex>
              ))}
            </Flex>
          ) : (
            <Scroller fillWidth gap="4" onItemClick={handleControlClick}>
              {spotlight.map((image, index) => (
                <Flex
                  key={index}
                  style={{
                    border:
                      activeIndex === index
                        ? "2px solid var(--brand-solid-strong)"
                        : "none",
                    cursor: "pointer",
                    borderRadius: "var(--radius-m-nest-4)",
                    transition: "border 0.3s ease",
                  }}
                  padding="4"
                  width="80"
                  height="80"
                >
                  <SmartImage
                    alt={image.title}
                    aspectRatio="1 / 1"
                    sizes="120px"
                    src={image.poster}
                    style={{
                      cursor: "pointer",
                      borderRadius: "var(--radius-m)",
                      transition: "background 0.3s ease",
                    }}
                  />
                </Flex>
              ))}
            </Scroller>
          )}
        </>
      )}
    </Flex>
  );
};

AnimeCarousel.displayName = "AnimeCarousel";
export { AnimeCarousel };
