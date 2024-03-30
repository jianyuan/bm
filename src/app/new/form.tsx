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
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";

import { addBookmarkAction } from "@/actions/add-bookmark-action";
import { getMetadataAction } from "@/actions/get-metadata-action";
import { AddBookmarkSchema } from "@/actions/schemas";
import { captureScreenshotAction } from "@/actions/screenshot-action";
import { FaviconInput } from "@/components/FaviconInput";

export default function NewBookmarkForm() {
  const router = useRouter();

  const addBookmark = useAction(addBookmarkAction, {
    onSuccess: () => {
      router.back();
    },
    onError: (error) => {
      if (error.validationErrors) {
        form.setErrors(error.validationErrors);
      }
    },
  });
  const getMetadata = useAction(getMetadataAction, {
    onSuccess: (data) => {
      for (const [k, v] of Object.entries(data)) {
        if (form.isTouched(k)) {
          continue;
        }

        form.setFieldValue(k, v);
      }
    },
  });
  const captureScreenshot = useAction(captureScreenshotAction, {
    onSuccess: (data) => {
      setScreenshotUrl(data.screenshotUrl);
      form.setFieldValue("screenshot", data.id);
    },
  });

  const debouncedGetMetadata = useDebouncedCallback(
    getMetadata.execute,
    [],
    1000
  );

  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const debouncedCaptureScreenshot = useDebouncedCallback(
    captureScreenshot.execute,
    [],
    1000
  );

  const form = useForm<AddBookmarkSchema>({
    initialValues: {
      url: "",
      title: "",
      description: "",
      tags: [],
      favicon: null,
      screenshot: null,
    },
    onValuesChange(values, previous) {
      if (values.url !== previous.url) {
        form.setFieldValue("favicon", null);
        debouncedGetMetadata(values.url);
        debouncedCaptureScreenshot(values.url);
      }
    },
  });

  return (
    <form onSubmit={form.onSubmit(addBookmark.execute)}>
      <Stack>
        <TextInput
          label="URL"
          type="url"
          leftSection={<FaviconInput {...form.getInputProps("favicon")} />}
          {...form.getInputProps("url")}
        />
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
