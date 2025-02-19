"use client";

import { forwardRef, useState } from "react";
import { IconButton, StylePanel, Flex } from ".";
import styles from "./StyleOverlay.module.scss";

interface StyleOverlayProps extends React.ComponentProps<typeof Flex> {}

const StyleOverlay = forwardRef<HTMLDivElement, StyleOverlayProps>(
  ({ ...rest }, ref) => {
    const [isOpen, setIsOpen] = useState(false);

    const togglePanel = () => {
      setIsOpen(!isOpen);
    };

    return (
      <Flex ref={ref} {...rest} fillHeight zIndex={1} alignItems="center">
        <IconButton
          variant={isOpen ? "secondary" : "primary"}
          onClick={togglePanel}
          icon={isOpen ? "close" : "sparkle"}
          tooltip="Styles Setting"
          tooltipPosition="bottom"
        />
        <Flex
          hide="s"
          as="aside"
          className={`${styles.panel} ${isOpen && styles.open}`}
          style={{
            maxWidth: "calc(100% - var(--static-space-16))",
            maxHeight: "calc(100% - var(--static-space-16))",
          }}
          fillHeight
          position="fixed"
          shadow="xl"
          top="8"
          right="8"
          transition="macro-medium"
          background="page"
          overflow="hidden"
          radius="xl"
          border="neutral-medium"
        >
          <Flex fillWidth position="absolute" right="0">
            <Flex position="absolute" right="0" padding="12">
              <IconButton
                variant={"primary"}
                onClick={togglePanel}
                icon={"close"}
              />
            </Flex>
          </Flex>
          <StylePanel fill overflowY="scroll" padding="16" />
        </Flex>
        <Flex
          show="s"
          as="aside"
          className={`${styles.panel} ${isOpen && styles.open}`}
          maxWidth={28}
          style={{
            maxWidth: "calc(100% - var(--static-space-16))",
            maxHeight: "calc(100% - var(--static-space-16))",
          }}
          fillHeight
          position="fixed"
          shadow="xl"
          top="8"
          right="8"
          transition="macro-medium"
          background="page"
          overflow="hidden"
          radius="xl"
          border="neutral-medium"
        >
          <Flex fillWidth position="absolute" right="0">
            <Flex position="absolute" right="0" padding="12">
              <IconButton
                variant={"primary"}
                onClick={togglePanel}
                icon={"close"}
              />
            </Flex>
          </Flex>
          <StylePanel fill overflowY="scroll" padding="16" />
        </Flex>
      </Flex>
    );
  }
);

StyleOverlay.displayName = "StyleOverlay";
export { StyleOverlay };
