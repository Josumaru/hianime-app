import { Flex, LetterFx, Text } from "@/once-ui/components";
import { NextPage } from "next";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  return (
    <Flex fillHeight fillWidth justifyContent={"center"} alignItems={"center"}>
      <Text variant="code-default-l">
        <LetterFx speed="medium" trigger="instant">
          This page under construction.... ૮(˶ㅠ︿ㅠ)ა
        </LetterFx>
      </Text>
    </Flex>
  );
};

export default Page;
