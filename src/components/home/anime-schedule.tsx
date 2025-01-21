"use client";
import { encrypt } from "@/lib/crypto";
import { getSchedule } from "@/lib/hianime";
import {
  Column,
  Flex,
  Heading,
  Row,
  SmartLink,
  Tag,
  Text,
} from "@/once-ui/components";
import { Schedule } from "@/types/schedule";
import { NextPage } from "next";
import { useEffect, useState } from "react";

interface Props {}

const AnimeSchedule: NextPage<Props> = ({}) => {
  const [currentLine, setCurrentLine] = useState<number>(0);

  const [schedules, setSchedules] = useState<Schedule[] | null>();

  const formatTo12Hour = (time: string): string => {
    const [hour, minute] = time.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;
  };
  const isAfterSpecificTime = (specificTime: string): boolean => {
    const time = parseInt(specificTime.split(":").join(""));
    const now = parseInt(`${new Date().getHours()}${new Date().getMinutes()}`);
    return now > time;
  };
  const getDayAbbreviation = (dateString: string): string => {
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const date = new Date(dateString);
    return days[date.getDay()];
  };
  useEffect(() => {
    const fetchData = async () => {
      const schedules = await getSchedule();
      setSchedules(schedules);
      schedules[0].results.some((schedule, index) => {
        const isAfter = isAfterSpecificTime(schedule.time);
        console.log(schedule.time);
        console.log(new Date().getHours());
        if (!isAfter) {
          setCurrentLine(index === 0 ? 0 : index - 1);
          return true;
        }
      });
    };
    fetchData();
  }, []);

  if (!schedules) {
    return null;
  }

  return (
    <Flex fillWidth padding="s" direction="column" justifyContent="center">
      <Heading as="h2" variant="display-default-m" align="center">
        Schedule
      </Heading>
      <Text marginBottom="32" align="center" onBackground="neutral-weak">
        Stay tuned for the latest anime episodes today
      </Text>
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
            {schedules[0].results?.map((schedule, index) => (
              <tbody key={index}>
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
                          index < currentLine ? "brand-medium" : "info-strong"
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
              </tbody>
            ))}
          </table>
        </Column>
      </Flex>
    </Flex>
  );
};

export default AnimeSchedule;
