"use client";

import { useRouter } from "next/navigation";

import NewBookmarkForm from "@/app/(authed)/new/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function NewModal() {
  const router = useRouter();

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          router.back();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New bookmark</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <NewBookmarkForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
