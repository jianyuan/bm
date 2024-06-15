"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useDebouncedCallback } from "@react-hookz/web";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addBookmarkAction } from "@/lib/server/actions/add-bookmark-action";
import { getMetadataAction } from "@/lib/server/actions/get-metadata-action";
import {
  AddBookmarkSchema,
  addBookmarkSchema,
} from "@/lib/server/actions/schemas";
import { captureScreenshotAction } from "@/lib/server/actions/screenshot-action";

export default function NewBookmarkForm() {
  const router = useRouter();

  const addBookmark = useAction(addBookmarkAction, {
    onSuccess: () => {
      router.back();
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const getMetadata = useAction(getMetadataAction, {
    onSuccess: ({ data }) => {
      if (data?.title) {
        form.setValue("title", data.title);
      }

      if (data?.description) {
        form.setValue("description", data.description);
      }

      if (data?.favicon) {
        form.setValue("favicon", data.favicon);
      }
    },
  });
  const debouncedGetMetadata = useDebouncedCallback(
    getMetadata.execute,
    [],
    1000
  );

  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const captureScreenshot = useAction(captureScreenshotAction, {
    onSuccess: (data) => {
      setScreenshotUrl(data.screenshotUrl);
      form.setValue("screenshot", data.id);
    },
  });
  const debouncedCaptureScreenshot = useDebouncedCallback(
    captureScreenshot.execute,
    [],
    1000
  );

  const form = useForm<AddBookmarkSchema>({
    resolver: zodResolver(addBookmarkSchema),
    defaultValues: {
      url: "",
      title: "",
      description: "",
      tags: [],
      favicon: null,
      screenshot: null,
    },
    disabled: addBookmark.status === "executing",
  });

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "url" && value.url) {
        form.setValue("favicon", null);
        debouncedGetMetadata(value.url);
        debouncedCaptureScreenshot(value.url);
      }
    });
    return () => subscription.unsubscribe();
  }, [debouncedCaptureScreenshot, debouncedGetMetadata, form, getMetadata]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(addBookmark.execute)}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl className="inline-flex space-y-2 items-center">
                  <Input type="url" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <TagsInput label="Tags" {...form.getInputProps("tags")} /> */}
          {screenshotUrl && (
            <div>
              <img
                src={screenshotUrl}
                className="w-[350px] h-auto object-contain"
                alt="Screenshot"
              />
            </div>
          )}
        </div>
        <Button type="submit">Add</Button>
      </form>
    </Form>
  );
}
