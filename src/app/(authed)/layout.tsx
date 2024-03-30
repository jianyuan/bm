"use client";

import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  AppShellNavbar,
  Burger,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";

export default function AuthedLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShellHeader>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <div>BM</div>
      </AppShellHeader>
      <AppShellNavbar p="md">Navbar</AppShellNavbar>
      <AppShellMain>
        {children}
        {modal}
      </AppShellMain>
    </AppShell>
  );
}
