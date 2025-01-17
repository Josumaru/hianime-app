"use client";

import {
  Column,
  Flex,
  Heading,
  LetterFx,
  RevealFx,
  Row,
  Scroller,
  SmartImage,
  Tag,
  Text,
} from "@/once-ui/components";
import { Data } from "@/types/manga/popular";
import { useEffect, useState, useRef } from "react";

interface CarouselProps extends React.ComponentProps<typeof Flex> {
  mangas: Data[];
  indicator?: "line" | "thumbnail";
  aspectRatio?: string;
  sizes?: string;
  revealedByDefault?: boolean;
}

const MangaCarousel: React.FC<CarouselProps> = ({
  mangas = [],
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
  const reverseProxyBaseUrl = process.env.NEXT_PUBLIC_REVERSE_PROXY;
  const preloadNextImage = (nextIndex: number) => {
    if (nextIndex >= 0 && nextIndex < mangas.length) {
      nextImageRef.current = new Image();
      nextImageRef.current.src = `${reverseProxyBaseUrl}${reverseProxyBaseUrl}https://uploads.mangadex.org/covers/${
        mangas[nextIndex].id
      }/${
        mangas[nextIndex].relationships.find(
          (relationship) => relationship.type == "cover_art"
        )?.attributes?.fileName
      }.512.jpg`;
    }
  };

  const handleImageClick = () => {
    if (mangas.length > 1) {
      const nextIndex = (activeIndex + 1) % mangas.length;
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

  if (mangas.length === 0) {
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
      >
        <SmartImage
          sizes={sizes}
          priority
          radius="l"
          objectFit="cover"
          alt={mangas[activeIndex]?.attributes.title.en}
          aspectRatio={aspectRatio}
          src={`${reverseProxyBaseUrl}https://uploads.mangadex.org/covers/${
            mangas[activeIndex].id
          }/${
            mangas[activeIndex].relationships.find(
              (relationship) => relationship.type == "cover_art"
            )?.attributes?.fileName
          }.256.jpg`}
          style={{
            border: "1px solid var(--neutral-alpha-weak)",
            ...(mangas.length > 1 && {
              cursor: "pointer",
              transform: "translateX(-50)",
            }),
            filter: "blur(90px)",
          }}
          opacity={40}
        />

        <Flex position="absolute" fillWidth fillHeight>
          <Row padding="l" gap="l" hide="s">
            <Flex fillWidth>
              <SmartImage
                priority
                radius="l"
                alt={mangas[activeIndex]?.attributes.title.en}
                aspectRatio="9/16"
                src={`${reverseProxyBaseUrl}https://uploads.mangadex.org/covers/${
                  mangas[activeIndex].id
                }/${
                  mangas[activeIndex].relationships.find(
                    (relationship) => relationship.type == "cover_art"
                  )?.attributes?.fileName
                }.512.jpg`}
                style={{
                  border: "1px solid var(--neutral-alpha-weak)",
                  ...(mangas.length > 1 && {
                    cursor: "pointer",
                  }),
                  aspectRatio: "9/16",
                }}
              />
            </Flex>
            <Flex direction="column" justifyContent="space-between">
              <Column gap="2">
                <Heading
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    WebkitLineClamp: 1,
                  }}
                >
                  <LetterFx trigger="instant">
                    {mangas[activeIndex]?.attributes.altTitles.find(
                      (title) => title
                    )?.["ja-ro"] ?? mangas[activeIndex]?.attributes.title.en}
                  </LetterFx>
                </Heading>
                <Row gap="8">
                  {mangas[activeIndex]?.attributes.tags
                    .slice(0, 3)
                    .map((tag) => (
                      <Tag
                        key={tag.id}
                        opacity={80}
                        variant="brand"
                        label={tag.attributes.name.en}
                      />
                    ))}
                </Row>
                <Text variant="code-default-xl">
                  {mangas[activeIndex]?.attributes.description.en}
                </Text>
              </Column>
              <Flex justifyContent="space-between">
                <Text
                  variant="body-strong-l"
                  style={{
                    fontStyle: "italic",
                  }}
                >
                  {mangas[activeIndex]?.relationships.find(
                    (relationship) => relationship.type == "author"
                  )?.attributes?.name ?? "Unknown"}
                </Text>
                <Text variant="body-strong-l">NO. {activeIndex + 1}</Text>
              </Flex>
            </Flex>
          </Row>
          <Row gap="s" show="s">
            <Flex fillWidth>
              <SmartImage
                priority
                radius="l"
                alt={mangas[activeIndex]?.attributes.title.en}
                aspectRatio="9/16"
                src={`${reverseProxyBaseUrl}https://uploads.mangadex.org/covers/${
                  mangas[activeIndex].id
                }/${
                  mangas[activeIndex].relationships.find(
                    (relationship) => relationship.type == "cover_art"
                  )?.attributes?.fileName
                }.512.jpg`}
                style={{
                  border: "1px solid var(--neutral-alpha-weak)",
                  ...(mangas.length > 1 && {
                    cursor: "pointer",
                  }),
                  aspectRatio: "9/16",
                }}
              />
            </Flex>
            <Flex direction="column" justifyContent="space-between">
              <Column gap="2">
                <Heading
                  as={"h3"}
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    WebkitLineClamp: 1,
                  }}
                >
                  <LetterFx trigger="instant">
                    {mangas[activeIndex]?.attributes.altTitles.find(
                      (title) => title
                    )?.["ja-ro"] ?? mangas[activeIndex]?.attributes.title.en}
                  </LetterFx>
                </Heading>
                <Row gap="8">
                  {mangas[activeIndex]?.attributes.tags
                    .slice(0, 2)
                    .map((tag) => (
                      <Tag
                        key={tag.id}
                        opacity={80}
                        variant="brand"
                        label={tag.attributes.name.en}
                      />
                    ))}
                </Row>
                <Text
                  variant="code-default-s"
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    WebkitLineClamp: 6,
                  }}
                >
                  {mangas[activeIndex]?.attributes.description.en}
                </Text>
              </Column>
              <Flex justifyContent="space-between">
                <Text
                  variant="body-strong-m"
                  style={{
                    fontStyle: "italic",
                  }}
                >
                  {mangas[activeIndex]?.relationships.find(
                    (relationship) => relationship.type == "author"
                  )?.attributes?.name ?? "Unknown"}
                </Text>
                <Text variant="body-strong-m">NO. {activeIndex + 1}</Text>
              </Flex>
            </Flex>
          </Row>
        </Flex>
      </RevealFx>
      {mangas.length > 1 && (
        <>
          {indicator === "line" ? (
            <Flex gap="4" paddingX="s" fillWidth justifyContent="center">
              {mangas.map((_, index) => (
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
              {mangas.map((image, index) => (
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
                    alt={image.attributes.title.en}
                    aspectRatio="1 / 1"
                    sizes="120px"
                    src={`${reverseProxyBaseUrl}https://uploads.mangadex.org/covers/${
                      image.id
                    }/${
                      image.relationships.find(
                        (relationship) => relationship.type == "cover_art"
                      )?.attributes?.fileName
                    }.256.jpg`}
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

MangaCarousel.displayName = "MangaCarousel";
export { MangaCarousel };
