"use client";

import React, { forwardRef } from "react";
import classNames from "classnames";

import { Flex, Text, Skeleton, Tag, TagProps, Avatar, AvatarProps } from ".";

interface UserProps {
  name?: string;
  children?: React.ReactNode;
  subline?: React.ReactNode;
  tag?: string;
  tagProps?: TagProps;
  loading?: boolean;
  avatarProps?: AvatarProps;
  className?: string;
}

const UserWatch = forwardRef<HTMLDivElement, UserProps>(
  (
    {
      name,
      children,
      subline,
      tagProps = {},
      loading = false,
      avatarProps = {},
      className,
    },
    ref
  ) => {
    const { src, value, empty, ...restAvatarProps } = avatarProps;
    const isEmpty = empty || (!src && !value);

    return (
      <Flex
        ref={ref}
        alignItems="center"
        gap="8"
        fillWidth
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          lineClamp: 2,
          maxLines: 2,
          maxWidth: "100%",
        }}
        className={classNames(className)}
      >
        <Avatar
          size="m"
          src={src}
          value={value}
          empty={isEmpty}
          loading={loading}
          {...restAvatarProps}
        />
        {children}
        {name && (
          <Flex direction="column" paddingLeft="4" paddingRight="12">
            {loading ? (
              <Flex minWidth={6} paddingY="4">
                <Skeleton
                  width="xl"
                  height="m"
                  shape="line"
                  aria-label="Loading name"
                />
              </Flex>
            ) : (
              <Flex
                gap="8"
                fillWidth
                alignItems="center"
                style={{
                  maxWidth: "calc(100vw)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  lineClamp: 2,
                  maxLines: 2,
                }}
              >
                <Text
                  variant="heading-strong-xs"
                  onBackground="neutral-strong"
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    lineClamp: 2,
                    maxLines: 2,
                    maxWidth: "70%",
                  }}
                >
                  {name}
                </Text>
                {tagProps.label && (
                  <Tag size="s" {...tagProps}>
                    {tagProps.label}
                  </Tag>
                )}
              </Flex>
            )}
            {loading ? (
              <Flex paddingY="4">
                <Skeleton
                  width="l"
                  height="xs"
                  shape="line"
                  aria-label="Loading subline"
                />
              </Flex>
            ) : (
              <>
                <Flex show="s">
                  <Text
                    wrap="nowrap"
                    variant="body-default-xs"
                    onBackground="neutral-weak"
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      lineClamp: 2,
                      maxLines: 2,
                      maxWidth: "60%",
                    }}
                  >
                    {subline}
                  </Text>
                </Flex>
                <Flex hide="s">
                  <Text
                    wrap="nowrap"
                    variant="body-default-xs"
                    onBackground="neutral-weak"
                  >
                    {subline}
                  </Text>
                </Flex>
              </>
            )}
          </Flex>
        )}
      </Flex>
    );
  }
);

UserWatch.displayName = "UserWatch";

export { UserWatch };
export type { UserProps };
