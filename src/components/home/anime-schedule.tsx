"use client";
import { encrypt } from "@/lib/crypto";
import { getSchedule } from "@/lib/hianime";
import {
  Column,
  Flex,
  Line,
  Row,
  SmartLink,
  Tag,
  Text,
} from "@/once-ui/components";
import { Schedule } from "@/types/hianime";
// import { Schedule } from "@/types/schedule";
import { NextPage } from "next";
import { useEffect, useState } from "react";

interface Props {
  schedule: Schedule[];
}

const AnimeSchedule: NextPage<Props> = ({ schedule }) => {
  const [currentLine, setCurrentLine] = useState<number>(0);

  const formatTo12Hour = (time: string): string => {
    const [hour, minute] = time.split(":").map(Number); // Pisahkan jam dan menit
    const period = hour >= 12 ? "PM" : "AM"; // Tentukan AM atau PM
    const formattedHour = hour % 12 || 12; // Ubah ke format 12 jam (0 jadi 12)
    return `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;
  };
  const isAfterSpecificTime = (specificTime: string): boolean => {
    const [hour, minute] = specificTime.split(":").map(Number);

    const now = new Date();
    const specificDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      minute
    );

    return now > specificDate;
  };
  const getDayAbbreviation = (dateString: string): string => {
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const date = new Date(dateString);
    return days[date.getDay()];
  };
  useEffect(() => {
    const fetchData = async () => {
      //   const schedules = await getSchedule();
      //   setSchedules(schedules);
      //   setCurrentSchedules(schedules[0]);
      schedule.map((schedule, index) => {
        const isAfter = isAfterSpecificTime(schedule.time);
        if (!isAfter) {
          setCurrentLine(index == 0 ? 0 : index - 1);
          return;
        }
      });
    };
    fetchData();
  }, []);

  return (
    <Flex fillWidth padding="s">
      <Flex
        fillWidth
        padding="4"
        background="brand-medium"
        border="brand-medium"
        radius="l"
        opacity={70}
      >
        <Column fillWidth>
          <table>
            {schedule?.map((schedule, index) => (
              <tbody key={index}>
                <tr>
                  <td>
                    <Row
                      style={{ display: index != 0 ? "none" : "block" }}
                      paddingX="s"
                      marginTop="8"
                    >
                      <Column justifyContent="center" alignItems="center">
                        <Text>
                          {getDayAbbreviation(schedule.releaseDate.toString())}
                        </Text>
                        <Text variant="code-strong-l">
                          {new Date(schedule.releaseDate).getDate()}
                        </Text>
                      </Column>
                    </Row>
                  </td>
                  <td width={"100%"}>
                    <SmartLink href={`/anime/detail/${encrypt(schedule.id)}`}>
                      <Column
                        marginTop="8"
                        onBackground={
                          index <= currentLine ? "brand-medium" : "info-strong"
                        }
                        fillWidth
                      >
                        <Text
                          style={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            WebkitLineClamp: 1,
                          }}
                        >
                          {schedule.japanese_title}
                        </Text>
                        <Text>{formatTo12Hour(schedule.time)}</Text>
                      </Column>
                    </SmartLink>
                  </td>
                  <td>
                    <Flex fillWidth>
                      <Tag
                        label={`Episode ${schedule.episode_no}`}
                        variant="warning"
                        fillWidth
                        hide="s"
                        size="m"
                      />
                    </Flex>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td colSpan={2}>
                    {currentLine == index && (
                      <Flex
                        style={{ height: 4 }}
                        fillWidth
                        radius="s"
                        background="warning-strong"
                      />
                    )}
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
        </Column>
      </Flex>
    </Flex>
  );
};

export default AnimeSchedule;
