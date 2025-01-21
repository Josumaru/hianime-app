"use client";

import Footer from "@/components/home/common/footer";
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
      <Footer />
    </Column>
  );
};

export default Layout;
