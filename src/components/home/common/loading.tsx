import { Flex, Spinner } from "@/once-ui/components";
import { NextPage } from "next";

interface Props {}

const Loading: NextPage<Props> = ({}) => {
  return (
    <Flex
      width={"l"}
      alignItems="center"
      justifyContent="center"
      aspectRatio={"16/9"}
    >
      <Spinner size="xl" />
    </Flex>
  );
};

export default Loading;
