"use client";

import { forwardRef, useState } from "react";
import {
  IconButton,
  StylePanel,
  Flex,
  NavIcon,
  Column,
  SmartLink,
  Text,
  Heading,
  Row,
  Icon,
  Button,
} from ".";
import styles from "./NavbarOverlay.module.scss";
import { HiOutlineHome, HiOutlineViewColumns } from "react-icons/hi2";
import { HiOutlineViewGrid } from "react-icons/hi";

interface NavbarOverlayProps extends React.ComponentProps<typeof Flex> {}

const NavbarOverlay = forwardRef<HTMLDivElement, NavbarOverlayProps>(
  ({ ...rest }, ref) => {
    const [isOpen, setIsOpen] = useState(false);

    const togglePanel = () => {
      setIsOpen(!isOpen);
    };

    return (
      <Flex ref={ref} {...rest} fillHeight alignItems="center">
        <NavIcon onClick={togglePanel} isActive={isOpen} />
        <Flex
          as="aside"
          className={`${styles.panel} ${isOpen && styles.open}`}
          maxWidth={28}
          style={{
            maxWidth: "calc(100% - var(--static-space-16))",
            maxHeight: "calc(100% - var(--static-space-16))",
            zIndex: 15,
          }}
          fillHeight
          position="fixed"
          shadow="xl"
          top="8"
          left="8"
          transition="macro-medium"
          background="page"
          overflow="hidden"
          radius="xl"
          border="neutral-medium"
        >
          <Flex fillWidth position="absolute" right="0">
            <Flex position="absolute" left="0" padding="12">
              <IconButton
                variant={"primary"}
                onClick={togglePanel}
                icon={"close"}
              />
            </Flex>
          </Flex>
          <Flex gap="2" direction="column" fillWidth padding="16">
            <Column marginTop="48" gap="8">
              <SmartLink href="/home" fillWidth>
                <Button
                  variant="secondary"
                  fillWidth
                  justifyContent="center"
                  onClick={() => setIsOpen(false)}
                >
                  <Row
                    fillWidth
                    justifyContent="center"
                    alignItems="center"
                    gap="4"
                  >
                    <HiOutlineHome />
                    <Text>Home</Text>
                  </Row>
                </Button>
              </SmartLink>
              <SmartLink href="/anime" fillWidth>
                <Button
                  variant="secondary"
                  fillWidth
                  onClick={() => setIsOpen(false)}
                >
                  <Row
                    fillWidth
                    justifyContent="center"
                    alignItems="center"
                    gap="4"
                  >
                    <HiOutlineViewGrid />
                    <Text>Anime</Text>
                  </Row>
                </Button>
              </SmartLink>
              <SmartLink href="/manga" fillWidth>
                <Button
                  variant="secondary"
                  fillWidth
                  onClick={() => setIsOpen(false)}
                >
                  <Row
                    fillWidth
                    justifyContent="center"
                    alignItems="center"
                    gap="4"
                  >
                    <HiOutlineViewColumns />
                    <Text>Manga</Text>
                  </Row>
                </Button>
              </SmartLink>
              <SmartLink href="/schedules" fillWidth>
                <Button
                  variant="secondary"
                  fillWidth
                  onClick={() => setIsOpen(false)}
                >
                  <Row
                    fillWidth
                    justifyContent="center"
                    alignItems="center"
                    gap="4"
                  >
                    <HiOutlineViewGrid />
                    <Text>Schedules</Text>
                  </Row>
                </Button>
              </SmartLink>
            </Column>
          </Flex>
        </Flex>
      </Flex>
    );
  }
);

NavbarOverlay.displayName = "NavbarOverlay";
export { NavbarOverlay };
