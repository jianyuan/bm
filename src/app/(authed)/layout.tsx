"use client";

import React from "react";

export default function AuthedLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <div>
      <header>
        <div>BM</div>
      </header>
      <nav>Navbar</nav>
      <main>
        {children}
        {modal}
      </main>
    </div>
  );
}
