"use client";

import NavigationBar from "@/components/home/common/navigation-bar";
import { Column } from "@/once-ui/components";
import { NextPage } from "next";

interface Props {
  children: React.ReactNode;
}
const Layout: NextPage<Props> = ({ children }) => {
  return (
    <Column fillWidth fillHeight>
      <NavigationBar />
      {children}
    </Column>
  );
};

export default Layout;
