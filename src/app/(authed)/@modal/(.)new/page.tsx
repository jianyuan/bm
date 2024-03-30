"use client";

import { Modal } from "@mantine/core";
import { useRouter } from "next/navigation";

import NewBookmarkForm from "@/app/(authed)/new/form";

export default function NewModal() {
  const router = useRouter();

  return (
    <Modal opened onClose={() => router.back()} title="New bookmark">
      <NewBookmarkForm />
    </Modal>
  );
}
