"use client";

import { Button, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

import { addBookmark } from "@/actions/bookmark";

export default function NewBookmarkForm() {
  const form = useForm<{ url: string; title: string }>();

  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        const result = await addBookmark(values);
        if (result?.errors) {
          form.setErrors(result.errors);
        }
      })}
    >
      <TextInput label="URL" type="url" {...form.getInputProps("url")} />
      <TextInput label="Title" {...form.getInputProps("title")} />
      <Button type="submit">Add</Button>
    </form>
  );
}
