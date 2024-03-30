"use client";

import { Button, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { useAction } from "next-safe-action/hooks";

import { SignInSchema, signInSchema } from "@/actions/schemas";
import { signInAction } from "@/actions/sign-in-action";

export default function SignInPage() {
  const form = useForm<SignInSchema>({
    validate: zodResolver(signInSchema),
  });
  const signIn = useAction(signInAction, {
    onError: (error) => {
      if (error.validationErrors) {
        form.setErrors(error.validationErrors);
      }
    },
  });

  return (
    <form onSubmit={form.onSubmit((values) => signIn.execute(values))}>
      <TextInput
        label="Username or email"
        {...form.getInputProps("usernameOrEmail")}
      />
      <PasswordInput label="Password" {...form.getInputProps("password")} />
      <Button type="submit">Sign in</Button>
    </form>
  );
}
