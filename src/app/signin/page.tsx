"use client";

import { Button, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";

import { signIn } from "@/actions/auth";
import { SignInSchema, signInSchema } from "@/actions/schemas";

export default function SignInPage() {
  const form = useForm<SignInSchema>({
    validate: zodResolver(signInSchema),
  });

  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        const result = await signIn(values);
        if (result?.errors) {
          form.setErrors(result.errors);
        }
      })}
    >
      <TextInput
        label="Username or email"
        {...form.getInputProps("usernameOrEmail")}
      />
      <PasswordInput label="Password" {...form.getInputProps("password")} />
      <Button type="submit">Sign in</Button>
    </form>
  );
}
