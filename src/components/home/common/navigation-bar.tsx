"use client";
import {
  Fade,
  Flex,
  Logo,
  NavIcon,
  Row,
  SmartLink,
  StyleOverlay,
  Text,
} from "@/once-ui/components";
import { NextPage } from "next";
import SearchBar from "./search-bar";
import { Sidebar } from "@/once-ui/modules";
import { NavbarOverlay } from "@/once-ui/components/NavbarOverlay";
import { useEffect, useState } from "react";

const NavigationBar: NextPage = ({}) => {
  const [hideNavbar, setHideNavbar] = useState(false);

  useEffect(() => {
    let lastScrollTop = 0;

    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop && scrollTop > 100) {
        setHideNavbar(true);
      } else {
        setHideNavbar(false);
      }

      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <Flex zIndex={10}>
      <Fade
        zIndex={3}
        pattern={{
          display: true,
          size: "4",
        }}
        position="fixed"
        top="0"
        left="0"
        to="bottom"
        height={hideNavbar ? 0 : 5}
        fillWidth
        blur={0.25}
      />
      <Row
        position="fixed"
        top="0"
        style={{
          transform: hideNavbar ? "translateY(-100%)" : "",
          transition: "transform 0.3s ease-in-out",
        }}
        fillWidth
        justifyContent="center"
        zIndex={3}
      >
        <Row
          data-border="rounded"
          justifyContent="space-between"
          maxWidth="l"
          padding="12"
        >
          <NavbarOverlay top="20" right="24" show="s" />
          <Row gap="12" hide="s">
            <SmartLink href="/home">
              <Text>Home</Text>
            </SmartLink>
            <SmartLink href="/anime">
              <Text>Anime</Text>
            </SmartLink>
            {/* <SmartLink href="/tv">
              <Text>TV</Text>
            </SmartLink>
            <SmartLink href="/movies">
              <Text>Movies</Text>
            </SmartLink> */}
            <SmartLink href="/manga">
              <Text>Manga</Text>
            </SmartLink>
          </Row>
          <Row gap="12">
            <SearchBar />
            <StyleOverlay top="20" right="24" />
          </Row>
        </Row>
      </Row>
    </Flex>
  );
};

export default NavigationBar;
