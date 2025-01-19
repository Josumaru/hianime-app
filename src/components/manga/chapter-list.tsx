"use client";
import { encrypt } from "@/lib/crypto";
import { useMangadexStore } from "@/lib/store";
import {
  Accordion,
  Button,
  Column,
  Dropdown,
  Line,
  Option,
  Row,
  SmartLink,
  Tag,
  Text,
} from "@/once-ui/components";
import { NextPage } from "next";
import { Fragment, useEffect, useState } from "react";

const ChapterList: NextPage = ({}) => {
  const { feedManga } = useMangadexStore();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [volume, setVolume] = useState<number[]>();
  const [chapter, setChapter] = useState<number[]>();
  const [showedVolume, setShowedVolume] = useState<number[]>();
  const [showedChapter, setShowedChapter] = useState<number[]>();
  useEffect(() => {
    setVolume([]);
    setChapter([]);
    let volumesSet = new Set();
    feedManga?.data.forEach((chapter) => {
      let volumeNumber = Number(chapter.attributes.volume);
      if (!volumesSet.has(volumeNumber)) {
        volumesSet.add(volumeNumber);
        setVolume((prev) => [...(prev || []), volumeNumber]);
      }
    });
    let ChapterSet = new Set();
    feedManga?.data.forEach((chapter) => {
      let chapterNumber = Number(chapter.attributes.chapter);
      if (!ChapterSet.has(chapterNumber)) {
        volumesSet.add(chapterNumber);
        setChapter((prev) => [...(prev || []), chapterNumber]);
      }
    });
  }, [feedManga]);

  useEffect(() => {
    setShowedVolume([]);
    feedManga?.data
      .slice(currentPage * 10 - 10, currentPage * 10)
      .map((chapter) => {
        setShowedVolume((prev) => [
          ...(prev || []),
          Number(chapter.attributes.volume),
        ]);
        setShowedChapter((prev) => [
          ...(prev || []),
          Number(chapter.attributes.chapter),
        ]);
      });
  }, [currentPage]);
  return (
    <Fragment>
      <Text onBackground="brand-medium">Chapter</Text>
      <Column maxHeight={"l"} gap="12" overflow="scroll">
        {volume?.map((volume, index) => {
          return (
            showedVolume?.includes(volume) && (
              <Dropdown
                key={volume}
                padding="2"
                radius="l"
                gap="2"
                fillHeight
                background="brand-medium"
                opacity={70}
              >
                <Option value="" label={`Volume ${volume}`} />
                <Line />
                {feedManga?.data
                  .slice(currentPage * 10 - 10, currentPage * 10)
                  .map((chapter) => (
                    <SmartLink
                      unstyled
                      key={chapter.id}
                      href={`/manga/read/${encrypt(chapter.id)}`}
                      fillWidth
                    >
                      <Button
                        variant="tertiary"
                        fillWidth
                        justifyContent="flex-start"
                      >
                        <Text variant="label-default-m">
                          Chapter {chapter.attributes.chapter}
                        </Text>
                        <Tag
                          variant="brand"
                          onBackground="brand-medium"
                          marginLeft="12"
                        >
                          {chapter.attributes.translatedLanguage.toUpperCase()}
                        </Tag>
                      </Button>
                    </SmartLink>
                  ))}
              </Dropdown>
            )
          );
        })}
      </Column>
      <Row gap="8" fillWidth justifyContent="center">
        {feedManga?.data.length! > 0 &&
          (() => {
            const totalPages = Math.ceil(feedManga?.data.length! / 10);
            const maxVisible = 7;
            const result = [];

            for (let i = 1; i <= totalPages; i++) {
              // Show the first, last, current, and neighbors of the current page
              if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - 1 && i <= currentPage + 1)
              ) {
                result.push(
                  <Tag
                    variant="brand"
                    width={"40"}
                    justifyContent="center"
                    radius="s"
                    key={i}
                    opacity={i === currentPage ? 90 : 50}
                    onClick={() => setCurrentPage(i)}
                  >
                    <Text style={{ cursor: "pointer" }}>{i}</Text>
                  </Tag>
                );
              } else if (
                (i === 2 && currentPage > 4) ||
                (i === totalPages - 1 && currentPage < totalPages - 3)
              ) {
                // Add ellipsis if necessary
                result.push(
                  <Text key={`ellipsis-${i}`} style={{ margin: "0 8px" }}>
                    ...
                  </Text>
                );
              }
            }
            return result;
          })()}
      </Row>
    </Fragment>
  );
};

export default ChapterList;
