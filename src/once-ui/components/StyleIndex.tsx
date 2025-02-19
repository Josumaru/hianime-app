"use client";

import { forwardRef, useState, useEffect } from "react";
import {
  Flex,
  Heading,
  Text,
  SegmentedControl,
  IconButton,
  Scroller,
  Column,
} from ".";

import styles from "./StylePanel.module.scss";
import classNames from "classnames";
import { style } from "../resources/config";
import { createCookies, getCookies } from "@/action/cookies-action";

interface StylePanelProps extends React.ComponentProps<typeof Flex> {
  style?: React.CSSProperties;
  className?: string;
}

type StylePreferences = {
  border: string;
  brand: string;
  accent: string;
  neutral: string;
  theme: string;
  solid: string;
  solidStyle: string;
  transition: string;
  scaling: string;
  surface: string;
};

const shapes = ["conservative", "playful", "rounded"];

const colorOptions = {
  brand: [
    "cyan",
    "blue",
    "indigo",
    "violet",
    "magenta",
    "pink",
    "red",
    "orange",
    "yellow",
    "moss",
    "green",
    "emerald",
    "aqua",
  ],
  accent: [
    "cyan",
    "blue",
    "indigo",
    "violet",
    "magenta",
    "pink",
    "red",
    "orange",
    "yellow",
    "moss",
    "green",
    "emerald",
    "aqua",
  ],
  neutral: ["sand", "gray", "slate"],
};

const StyleIndex = forwardRef<HTMLDivElement, StylePanelProps>(
  ({ ...rest }, ref) => {
    const [selectedShape, setSelectedShape] = useState(style.border);
    const [brandColor, setBrandColor] = useState(style.brand);
    const [accentColor, setAccentColor] = useState(style.accent);
    const [neutralColor, setNeutralColor] = useState(style.neutral);
    const [theme, setTheme] = useState(style.theme);
    const [solid, setSolid] = useState(style.solid);
    const [solidStyle, setSolidStyle] = useState(style.solidStyle);
    const [transition, setTransition] = useState(style.transition);
    const [scaling, setScaling] = useState(style.scaling);
    const [surface, setSurface] = useState(style.surface);
    const [increementalIndex, setIncreementalIndex] = useState(0);

    useEffect(() => {
      const root = document.documentElement;
      root.setAttribute("data-border", selectedShape);
      root.setAttribute("data-brand", brandColor);
      root.setAttribute("data-accent", accentColor);
      root.setAttribute("data-neutral", neutralColor);
      root.setAttribute("data-solid", solid);
      root.setAttribute("data-solid-style", solidStyle);
      root.setAttribute("data-theme", theme);
      root.setAttribute("data-transition", transition);
      root.setAttribute("data-scaling", scaling);
      root.setAttribute("data-surface", surface);
      root.setAttribute("data-transition", transition);
      setIncreementalIndex(increementalIndex + 1);
    }, [
      selectedShape,
      brandColor,
      accentColor,
      neutralColor,
      solid,
      solidStyle,
      theme,
      transition,
      surface,
      scaling,
    ]);

    useEffect(() => {
      if (increementalIndex == 0) return;
      const saveThemeSettings = async () => {
        const themeSettings: StylePreferences = {
          border: selectedShape,
          brand: brandColor,
          accent: accentColor,
          neutral: neutralColor,
          theme,
          solid,
          solidStyle,
          transition,
          scaling,
          surface,
        };
        await createCookies("_animanga_t_s", themeSettings, "theme");
      };

      saveThemeSettings();
    }, [increementalIndex]);

    useEffect(() => {
      const loadThemeSettings = async () => {
        const savedSettings = (await getCookies(
          "_animanga_t_s",
          "theme"
        )) as StylePreferences;
        if (savedSettings) {
          setSelectedShape(savedSettings.border || style.border);
          setBrandColor(savedSettings.brand || style.brand);
          setAccentColor(savedSettings.accent || style.accent);
          setNeutralColor(savedSettings.neutral || style.neutral);
          setTheme(savedSettings.theme || style.theme);
          setSolid(savedSettings.solid || style.solid);
          setSolidStyle(savedSettings.solidStyle || style.solidStyle);
          setTransition(savedSettings.transition || style.transition);
          setScaling(savedSettings.scaling || style.scaling);
          setSurface(savedSettings.surface || style.surface);
          const root = document.documentElement;
          root.setAttribute("data-border", savedSettings.border);
          root.setAttribute("data-brand", savedSettings.brand);
          root.setAttribute("data-accent", savedSettings.accent);
          root.setAttribute("data-neutral", savedSettings.neutral);
          root.setAttribute("data-solid", savedSettings.solid);
          root.setAttribute("data-solid-stylesavedSettings.", solidStyle);
          root.setAttribute("data-theme", savedSettings.theme);
          root.setAttribute("data-transition", savedSettings.transition);
          root.setAttribute("data-scaling", savedSettings.scaling);
          root.setAttribute("data-surface", savedSettings.surface);
          root.setAttribute("data-transition", savedSettings.transition);
        }
      };

      loadThemeSettings();
    }, []);

    return null;

    return (
      <Column fillWidth gap="16" ref={ref} {...rest} marginTop="24">
        {/* <Column paddingLeft="8" hide="s">
          <Heading align="left" as="h2" variant="display-default-m">
            Theme Preferences
          </Heading>
          <Text marginBottom="8" align="left" onBackground="neutral-weak">
            Customize your experience by selecting your preferred theme.
          </Text>
        </Column>
        <Column paddingLeft="8" show="s">
          <Heading align="left" as="h2" variant="display-default-xs">
            Theme Preferences
          </Heading>
          <Text marginBottom="8" align="left" onBackground="neutral-weak">
            Customize your experience by selecting your preferred theme.
          </Text>
        </Column> */}

        {/* <Heading as="h2" variant="heading-strong-s">
            Page
          </Heading>
          <Text variant="body-default-s" onBackground="neutral-weak">
            Customize global design settings
          </Text>
        </Column> */}

        <Column fillWidth border="neutral-alpha-medium" radius="l-4">
          <Flex
            borderBottom="neutral-alpha-medium"
            justifyContent="space-between"
            alignItems="center"
            fillWidth
            paddingX="24"
            paddingY="16"
            gap="24"
          >
            <Heading as="h2" variant="label-default-s">
              Theme
            </Heading>
            <Flex fillWidth>
              <SegmentedControl
                buttons={[
                  {
                    size: "l",
                    label: "Light",
                    value: "light",
                    prefixIcon: "light",
                  },
                  {
                    size: "l",
                    label: "Dark",
                    value: "dark",
                    prefixIcon: "dark",
                  },
                ]}
                onToggle={(value) => setTheme(value as "light" | "dark")}
                selected={theme}
              />
            </Flex>
          </Flex>
          <Flex
            justifyContent="space-between"
            alignItems="center"
            fillWidth
            paddingX="24"
            paddingY="16"
          >
            <Heading as="h2" variant="label-default-s">
              Shape
            </Heading>
            <Flex gap="4">
              {shapes.map((radius, index) => (
                <Flex
                  data-border={shapes[index]}
                  key={radius}
                  justifyContent="center"
                  alignItems="center"
                  className={classNames(
                    styles.select,
                    selectedShape === radius ? styles.selected : ""
                  )}
                  onClick={() => {
                    setSelectedShape(radius);
                  }}
                >
                  <IconButton variant="ghost" size="m">
                    <div
                      className={classNames(styles.neutral, styles.swatch)}
                    ></div>
                  </IconButton>
                </Flex>
              ))}
            </Flex>
          </Flex>
        </Column>

        <Column fillWidth paddingTop="12" paddingLeft="16" gap="4">
          <Heading as="h2" variant="heading-strong-s">
            Color
          </Heading>
          <Text variant="body-default-s" onBackground="neutral-weak">
            Customize color schemes
          </Text>
        </Column>
        <Column fillWidth border="neutral-medium" radius="l-4">
          <Flex
            borderBottom="neutral-alpha-medium"
            justifyContent="space-between"
            alignItems="center"
            fillWidth
            paddingX="24"
            paddingY="16"
            gap="24"
          >
            <Heading as="h2" variant="label-default-s">
              Brand
            </Heading>
            <Scroller minWidth={0}>
              {colorOptions.brand.map((color, index) => (
                <Flex
                  marginRight="2"
                  key={color}
                  justifyContent="center"
                  alignItems="center"
                  className={classNames(
                    styles.select,
                    brandColor === color ? styles.selected : ""
                  )}
                  onClick={() => {
                    setBrandColor(color);
                  }}
                >
                  <IconButton variant="ghost" size="m">
                    <div className={`${styles[color]} ${styles.swatch}`}></div>
                  </IconButton>
                </Flex>
              ))}
            </Scroller>
          </Flex>

          <Flex
            borderBottom="neutral-alpha-medium"
            justifyContent="space-between"
            alignItems="center"
            fillWidth
            paddingX="24"
            paddingY="16"
            gap="24"
          >
            <Heading as="h2" variant="label-default-s">
              Accent
            </Heading>
            <Scroller minWidth={0}>
              {colorOptions.accent.map((color, index) => (
                <Flex
                  marginRight="2"
                  key={color}
                  justifyContent="center"
                  alignItems="center"
                  className={classNames(
                    styles.select,
                    accentColor === color ? styles.selected : ""
                  )}
                  onClick={() => {
                    setAccentColor(color);
                  }}
                >
                  <IconButton variant="ghost" size="m">
                    <div className={`${styles[color]} ${styles.swatch}`}></div>
                  </IconButton>
                </Flex>
              ))}
            </Scroller>
          </Flex>

          <Flex
            justifyContent="space-between"
            alignItems="center"
            fillWidth
            paddingX="24"
            paddingY="16"
            gap="24"
          >
            <Heading as="h2" variant="label-default-s">
              Neutral
            </Heading>
            <Scroller minWidth={0}>
              {colorOptions.neutral.map((color, index) => (
                <Flex
                  marginRight="2"
                  key={color}
                  justifyContent="center"
                  alignItems="center"
                  className={classNames(
                    styles.select,
                    neutralColor === color ? styles.selected : ""
                  )}
                  onClick={() => {
                    setNeutralColor(color);
                  }}
                >
                  <IconButton variant="ghost" size="m">
                    <div className={`${styles[color]} ${styles.swatch}`}></div>
                  </IconButton>
                </Flex>
              ))}
            </Scroller>
          </Flex>
        </Column>

        <Column fillWidth paddingTop="12" paddingLeft="16" gap="4">
          <Heading as="h2" variant="heading-strong-s">
            Solid style
          </Heading>
          <Text variant="body-default-s" onBackground="neutral-weak">
            Customize the appearance of interactive elements
          </Text>
        </Column>
        <Column fillWidth border="neutral-medium" radius="l-4">
          <Flex
            borderBottom="neutral-alpha-medium"
            justifyContent="space-between"
            alignItems="center"
            fillWidth
            paddingX="24"
            paddingY="16"
            gap="24"
          >
            <Heading as="h2" variant="label-default-s">
              Style
            </Heading>
            <Flex fillWidth maxWidth={22} minWidth={0}>
              <SegmentedControl
                buttons={[
                  {
                    size: "l",
                    label: (
                      <Flex alignItems="center" gap="12">
                        <Flex
                          data-solid="color"
                          border="brand-strong"
                          solid="brand-weak"
                          position="relative"
                          width="24"
                          height="24"
                          radius="s"
                        ></Flex>
                        Color
                      </Flex>
                    ),
                    value: "color",
                  },
                  {
                    size: "l",
                    label: (
                      <Flex alignItems="center" gap="12">
                        <Flex
                          data-solid="inverse"
                          border="brand-strong"
                          solid="brand-strong"
                          position="relative"
                          width="24"
                          height="24"
                          radius="s"
                        ></Flex>
                        Inverse
                      </Flex>
                    ),
                    value: "inverse",
                  },
                  {
                    size: "l",
                    label: (
                      <Flex alignItems="center" gap="12">
                        <Flex
                          data-solid="contrast"
                          border="brand-strong"
                          solid="brand-strong"
                          position="relative"
                          width="24"
                          height="24"
                          radius="s"
                        ></Flex>
                        Contrast
                      </Flex>
                    ),
                    value: "contrast",
                  },
                ]}
                onToggle={(value) =>
                  setSolid(value as "color" | "contrast" | "inverse")
                }
                selected={solid}
              />
            </Flex>
          </Flex>
          <Flex
            justifyContent="space-between"
            alignItems="center"
            fillWidth
            paddingX="24"
            paddingY="16"
            gap="24"
          >
            <Heading as="h2" variant="label-default-s">
              Effect
            </Heading>
            <Flex fillWidth maxWidth={22} minWidth={0}>
              <SegmentedControl
                buttons={[
                  {
                    size: "l",
                    label: (
                      <Flex alignItems="center" gap="12">
                        <Flex
                          border="brand-strong"
                          solid="brand-weak"
                          position="relative"
                          width="24"
                          height="24"
                          radius="s"
                        ></Flex>
                        Flat
                      </Flex>
                    ),
                    value: "flat",
                  },
                  {
                    size: "l",
                    label: (
                      <Flex alignItems="center" gap="12">
                        <Flex
                          border="brand-strong"
                          style={{
                            boxShadow:
                              "inset 0 calc(-1 * var(--static-space-8)) var(--static-space-8) var(--brand-solid-strong)",
                          }}
                          solid="brand-weak"
                          position="relative"
                          width="24"
                          height="24"
                          radius="s"
                        ></Flex>
                        Plastic
                      </Flex>
                    ),
                    value: "plastic",
                  },
                ]}
                onToggle={(value) => setSolidStyle(value as "flat" | "plastic")}
                selected={solidStyle}
              />
            </Flex>
          </Flex>
        </Column>
        <Column fillWidth paddingTop="12" paddingLeft="16" gap="4">
          <Heading as="h2" variant="heading-strong-s">
            Advanced
          </Heading>
          <Text variant="body-default-s" onBackground="neutral-weak">
            Customize advanced styling options
          </Text>
        </Column>
        <Column fillWidth border="neutral-medium" radius="l-4">
          <Flex
            borderBottom="neutral-alpha-medium"
            justifyContent="space-between"
            alignItems="center"
            fillWidth
            paddingX="24"
            paddingY="16"
            gap="24"
          >
            <Heading as="h2" variant="label-default-s">
              Surface
            </Heading>
            <Flex fillWidth maxWidth={22} minWidth={0}>
              <SegmentedControl
                onToggle={(value) =>
                  setSurface(value as "translucent" | "filled")
                }
                selected={surface}
                buttons={[
                  {
                    size: "l",
                    label: "Filled",
                    value: "filled",
                  },
                  {
                    size: "l",
                    label: "Translucent",
                    value: "translucent",
                  },
                ]}
              />
            </Flex>
          </Flex>
          <Flex
            borderBottom="neutral-alpha-medium"
            justifyContent="space-between"
            alignItems="center"
            fillWidth
            paddingX="24"
            paddingY="16"
            gap="24"
          >
            <Heading as="h2" variant="label-default-s">
              Scaling
            </Heading>
            <Flex fillWidth maxWidth={22} minWidth={0}>
              <SegmentedControl
                onToggle={(value) =>
                  setScaling(value as "90" | "95" | "100" | "105" | "110")
                }
                selected={scaling}
                buttons={[
                  {
                    size: "l",
                    label: "90",
                    value: "90",
                  },
                  {
                    size: "l",
                    label: "95",
                    value: "95",
                  },
                  {
                    size: "l",
                    label: "100",
                    value: "100",
                  },
                  {
                    size: "l",
                    label: "105",
                    value: "105",
                  },
                  {
                    size: "l",
                    label: "110",
                    value: "110",
                  },
                ]}
              />
            </Flex>
          </Flex>
          <Flex
            justifyContent="space-between"
            alignItems="center"
            fillWidth
            paddingX="24"
            paddingY="16"
            gap="24"
          >
            <Heading as="h2" variant="label-default-s">
              Transition
            </Heading>
            <SegmentedControl
              onToggle={(value) =>
                setTransition(value as "all" | "micro" | "macro")
              }
              selected={transition}
              buttons={[
                {
                  size: "l",
                  label: "All",
                  value: "all",
                },
                {
                  size: "l",
                  label: "Micro",
                  value: "micro",
                },
                {
                  size: "l",
                  label: "Macro",
                  value: "macro",
                },
              ]}
            />
          </Flex>
        </Column>
      </Column>
    );
  }
);

StyleIndex.displayName = "StyleIndex";
export { StyleIndex };
