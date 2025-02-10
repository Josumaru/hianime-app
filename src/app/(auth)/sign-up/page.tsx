"use client";

import React, { useState } from "react";
import { NextPage } from "next";

import {
  Heading,
  Text,
  Button,
  Logo,
  Input,
  PasswordInput,
  SmartLink,
  SmartImage,
  useToast,
  Row,
  Column,
} from "@/once-ui/components";
import HomeBackground from "@/components/home/home-background";
import { useRouter } from "next/navigation";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const { addToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter()
  const validateLogin = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      return "Email and / or password is invalid.";
    }
    return null;
  };
  const validatePassword = () => {
    if (password != confirmPassword) {
      return "Confirm correct password.";
    }
    return null;
  };

  const handleSignUp = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("email", email);
      formData.append("name", name);
      formData.append("password", password);
      const sigUpResponse = await fetch("/api/v1/sign-up", {
        method: "POST",
        body: formData,
      });
      const responseData = await sigUpResponse.json();
      if (!sigUpResponse.ok) {
        throw new Error(responseData.message);
      }

      addToast({
        message: `Welcome ${name} ( ˶ˆᗜˆ˵ )`,
        variant: "success",
      });
      router.push("/home")
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
        alignItems="center"
        fillWidth
        fillHeight
        justifyContent="center"
        paddingBottom="8"
        gap="32"
      >
        <Row
          marginY="32"
          background="overlay"
          fillWidth
          radius="xl"
          overflow="hidden"
          border="brand-alpha-medium"
        >
          <Row fill hide="m">
            <SmartImage
              src="/images/login.png"
              alt="Preview image"
              sizes="560px"
            />
          </Row>
          <Column
            fillWidth
            gap="20"
            padding="32"
            position="relative"
            fillHeight
          >
            <Logo wordmark={false} size="l" />
            <Heading as="h3" variant="display-default-s">
              Welcome to Animanga
            </Heading>
            <Text onBackground="neutral-medium" marginBottom="24">
              Log in or
              <SmartLink href="/sign-in">sign in</SmartLink>
            </Text>
            <Column gap="-1" fillWidth>
              <Input
                id="name"
                label="Name"
                labelAsPlaceholder
                onChange={(e) => setName(e.target.value)}
                value={name}
                validate={validateLogin}
                errorMessage={false}
                radius="top"
              />
              <Input
                id="email"
                label="Email"
                labelAsPlaceholder
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                validate={validateLogin}
                errorMessage={false}
                radius="none"
              />
              <PasswordInput
                autoComplete="new-password"
                id="password"
                label="Password"
                labelAsPlaceholder
                radius="none"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                validate={validateLogin}
              />
              <PasswordInput
                autoComplete="new-password"
                id="password"
                label="Retype password"
                labelAsPlaceholder
                radius="bottom"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                validate={validatePassword}
              />
            </Column>
            <Button
              id="sign-up"
              label={isLoading ? "Loading" : "Sign Up"}
              disabled={isLoading}
              arrowIcon
              fillWidth
              onClick={() => handleSignUp()}
            />
          </Column>
        </Row>
      </Column>
    </Column>
  );
};

export default Page;
