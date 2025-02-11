"use client";
import {
  Background,
  Column,
  Logo,
  Row,
  SmartLink,
  Text,
} from "@/once-ui/components";
import { NextPage } from "next";
import { usePathname } from "next/navigation";

interface Props {}

const Footer: NextPage<Props> = ({}) => {
  const pathname = usePathname();

  if (pathname.startsWith("/manga/read")) {
    return null;
  }
  return (
    <Row
      position="relative"
      as="footer"
      fillWidth
      paddingX="l"
      paddingTop="128"
      paddingBottom="80"
    >
      <Background
        borderTop="brand-alpha-strong"
        mask={{
          x: 50,
          y: 0,
        }}
        position="absolute"
        grid={{
          display: true,
          width: "0.25rem",
          color: "brand-alpha-strong",
          height: "0.25rem",
        }}
      />
      <Column
        position="relative"
        textVariant="body-default-xs"
        onBackground="neutral-medium"
        alignItems="center"
        align="center"
        fillWidth
        gap="16"
      >
        <Logo wordmark={false} size="s" />
        <Text size="m">Animanga</Text>
        <Text size="m">
          <Text onBackground="neutral-weak">{new Date().getFullYear()} /</Text> Created using Once UI
        </Text>
        <SmartLink
          href="https://github.com/josumaru/hianime-app?tab=MIT-1-ov-file"
          target="_blank"
        >
          MIT License
        </SmartLink>
      </Column>
    </Row>
  );
};

export default Footer;
