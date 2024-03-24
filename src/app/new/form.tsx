"use client";

import { Button, Stack, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedCallback } from "@react-hookz/web";

import { addBookmark } from "@/actions/bookmark";
import { getMetadata } from "@/actions/metadata";
import { AddBookmarkSchema } from "@/actions/schemas";

export default function NewBookmarkForm() {
  const debouncedGetMetadata = useDebouncedCallback(
    async (url: string) => {
      const metadata = await getMetadata(url);
      if (metadata) {
        for (const [k, v] of Object.entries(metadata)) {
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

  const form = useForm<AddBookmarkSchema>({
    onValuesChange(values, previous) {
      if (values.url !== previous.url) {
        debouncedGetMetadata(values.url);
      }
    },
  });

  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        const result = await addBookmark(values);
        if (result?.errors) {
          form.setErrors(result.errors);
        }
      })}
    >
      <Stack>
        <TextInput label="URL" type="url" {...form.getInputProps("url")} />
        <TextInput label="Title" {...form.getInputProps("title")} />
        <Textarea label="Description" {...form.getInputProps("description")} />
      </Stack>
      <Button type="submit" mt="xl">
        Add
      </Button>
    </form>
  );
}
