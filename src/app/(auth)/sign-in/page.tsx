"use client";

import React, { useState } from "react";
import { NextPage } from "next";

import {
  Heading,
  Text,
  Button,
  Icon,
  InlineCode,
  Logo,
  Input,
  Avatar,
  AvatarGroup,
  Textarea,
  PasswordInput,
  SegmentedControl,
  SmartLink,
  Dialog,
  Feedback,
  SmartImage,
  Line,
  LogoCloud,
  Background,
  Select,
  useToast,
  Card,
  Fade,
  StatusIndicator,
  DateRangePicker,
  DateRange,
  TiltFx,
  HoloFx,
  IconButton,
  TagInput,
  Switch,
  Row,
  StyleOverlay,
  Flex,
  Column,
  Tag,
} from "@/once-ui/components";
import HomeBackground from "@/components/home/home-background";
import { useRouter } from "next/navigation";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const { addToast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [password, setPassword] = useState("");
  const router = useRouter();
  const validateLogin = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      return "Email and / or password is invalid.";
    }
    return null;
  };
  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      const sigUpResponse = await fetch("/api/v1/sign-in", {
        method: "POST",
        body: formData,
      });
      const responseData = await sigUpResponse.json();
      if (!sigUpResponse.ok) {
        throw new Error(responseData.message);
      }

      addToast({
        message: `Welcome back ( ˶ˆᗜˆ˵ )`,
        variant: "success",
      });
      router.push("/home");
    } catch (error: any) {
      addToast({
        message: error.message,
        variant: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Column fillWidth paddingY="80" paddingX="s" alignItems="center" flex={1}>
      <HomeBackground />
      <Column
        overflow="hidden"
        as="main"
        maxWidth="l"
        position="relative"
        radius="xl"
        fillHeight
        justifyContent="center"
        alignItems="center"
        fillWidth
        paddingBottom="8"
        gap="32"
      >
        <Row
          marginY="32"
          background="overlay"
          fillWidth
          radius="xl"
          border="neutral-alpha-weak"
          overflow="hidden"
        >
          <Row fill hide="m">
            <SmartImage
              src="/images/login.png"
              alt="Preview image"
              sizes="560px"
            />
          </Row>
          <Column fillWidth gap="20" padding="32" position="relative">
            <Logo wordmark={false} size="l" />
            <Heading as="h3" variant="display-default-s">
              Welcome to Animanga
            </Heading>
            <Text onBackground="neutral-medium" marginBottom="24">
              Log in or
              <SmartLink href="/sign-up">sign up</SmartLink>
            </Text>
            <Column gap="-1" fillWidth>
              <Input
                id="email"
                label="Email"
                labelAsPlaceholder
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                validate={validateLogin}
                errorMessage={false}
                radius="top"
              />
              <PasswordInput
                autoComplete="new-password"
                id="password"
                label="Password"
                labelAsPlaceholder
                radius="bottom"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                validate={validateLogin}
              />
            </Column>
            <Button
              id="sign-up"
              label={isLoading ? "Loading" : "Log in"}
              arrowIcon
              disabled={isLoading}
              fillWidth
              onClick={() => {
                handleSignIn();
              }}
            />
          </Column>
        </Row>
      </Column>
    </Column>
  );
};

export default Page;
