"use client";
import {
  Avatar,
  Fade,
  Flex,
  IconButton,
  Row,
  SmartLink,
  Text,
} from "@/once-ui/components";
import { NextPage } from "next";
import SearchBar from "./search-bar";
import { NavbarOverlay } from "@/once-ui/components/NavbarOverlay";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSettingStore } from "@/lib/store";
import { HiOutlineCog8Tooth } from "react-icons/hi2";
import { getCurrentUser } from "@/action/get-current-user";
import { PostgrestSingleResponse, UserResponse } from "@supabase/supabase-js";
import { users } from "@/db/schema";

interface IUserData {
  user: UserResponse;
  data: {
    userId: any;
    name: string;
    email: string;
    createdAt: string;
    animePreferences: string;
    mangaPreferences: string;
    themePreferences: string;
    profileImage: string;
  };
}

const NavigationBar: NextPage = ({}) => {
  const pathname = usePathname();
  const [user, setUser] = useState<IUserData | null>(null);
  const [userData, setUserData] = useState<typeof users | null>(null);
  const { isOpenSetting, setIsOpenSetting } = useSettingStore();

  const [hideNavbar, setHideNavbar] = useState(false);

  const fetchUser = async () => {
    const userData = await getCurrentUser();
    setUser(userData);
  };
  useEffect(() => {
    fetchUser();
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
    <Flex>
      <Fade
        zIndex={3}
        pattern={{
          display: true,
          size: "4",
        }}
        position="fixed"
        top="0"
        left="0"
        transition="micro-medium"
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
        }}
        transition="micro-medium"
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
            <SmartLink href="/manga">
              <Text>Manga</Text>
            </SmartLink>
            <SmartLink href="/schedules">
              <Text>Schedules</Text>
            </SmartLink>
          </Row>
          <Row gap="12" justifyContent="center" alignItems="center">
            <SearchBar />
            {user?.data ? (
              <SmartLink href="/preferences">
                <Avatar src={user.data.profileImage} />
              </SmartLink>
            ) : (
              <IconButton
                variant="primary"
                href="/sign-in"
                icon="person"
                tooltip="Click to sign in"
                tooltipPosition="bottom"
              />
            )}
            {/* <StyleOverlay top="20" right="24" /> */}
            {pathname.startsWith("/manga/read") && (
              <IconButton
                onClick={() => setIsOpenSetting(!isOpenSetting)}
                size="m"
                tooltip="Manga Setting"
                tooltipPosition="bottom"
                variant="primary"
              >
                <HiOutlineCog8Tooth size={23} />
              </IconButton>
            )}
          </Row>
        </Row>
      </Row>
    </Flex>
  );
};

export default NavigationBar;
