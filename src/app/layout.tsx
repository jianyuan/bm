import "@mantine/core/styles.css";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "BM",
  description: "Bookmarks manager",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <ModalsProvider>
            {children}
            {modal}
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
