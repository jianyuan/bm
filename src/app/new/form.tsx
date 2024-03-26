"use client";

import {
  Box,
  Button,
  Image,
  Stack,
  TagsInput,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedCallback } from "@react-hookz/web";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { addBookmark } from "@/actions/bookmark";
import { getMetadata } from "@/actions/metadata";
import { AddBookmarkSchema } from "@/actions/schemas";
import captureScreenshot from "@/actions/screenshot";

export default function NewBookmarkForm() {
  const router = useRouter();

  const debouncedGetMetadata = useDebouncedCallback(
    async (url: string) => {
      const result = await getMetadata({ url });
      if (result.success) {
        for (const [k, v] of Object.entries(result.data)) {
          if (form.isTouched(k)) {
            continue;
          }

          form.setFieldValue(k, v);
        }
      }
    },
    [],
    1000
  );

  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const debouncedCaptureScreenshot = useDebouncedCallback(
    async (url: string) => {
      const result = await captureScreenshot({ url });
      if (result.success) {
        setScreenshotUrl(result.data.screenshotUrl);
        form.setFieldValue("screenshot", result.data.id);
      }
    },
    [],
    1000
  );

  const form = useForm<AddBookmarkSchema>({
    initialValues: {
      url: "",
      title: "",
      description: "",
      tags: [],
      screenshot: null,
    },
    onValuesChange(values, previous) {
      if (values.url !== previous.url) {
        debouncedGetMetadata(values.url);
        debouncedCaptureScreenshot(values.url);
      }
    },
  });

  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        const result = await addBookmark(values);
        if (result.success) {
          router.back();
        } else {
          form.setErrors(result.errors);
        }
      })}
    >
      <Stack>
        <TextInput label="URL" type="url" {...form.getInputProps("url")} />
        <TextInput label="Title" {...form.getInputProps("title")} />
        <Textarea label="Description" {...form.getInputProps("description")} />
        <TagsInput label="Tags" {...form.getInputProps("tags")} />
        {screenshotUrl && (
          <Box>
            <Image
              src={screenshotUrl}
              radius="md"
              h={350}
              w="auto"
              fit="contain"
              alt="Screenshot"
            />
          </Box>
        )}
      </Stack>
      <Button type="submit" mt="xl">
        Add
      </Button>
    </form>
  );
}
