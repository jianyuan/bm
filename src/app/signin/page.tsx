"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignInSchema, signInSchema } from "@/lib/server/actions/schemas";
import { signInAction } from "@/lib/server/actions/sign-in-action";

export default function SignInPage() {
  const signIn = useAction(signInAction, {
    onError: ({ error: { validationErrors } }) => {
      if (!validationErrors) {
        return;
      }

      const { _errors: rootErrors, ...fieldErrors } = validationErrors;

      if (rootErrors) {
        rootErrors.forEach((message) => {
          form.setError("root", { message });
        });
      }

      Object.entries(fieldErrors).forEach(([key, { _errors: messages }]) => {
        if (!messages) {
          return;
        }

        messages.forEach((message) => {
          form.setError(key as keyof SignInSchema, { message });
        });
      });
    },
  });
  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    disabled: signIn.status === "executing",
  });

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(signIn.execute)}>
          <Card className="sm:mx-auto sm:w-full sm:max-w-sm">
            <CardHeader>
              <CardTitle>Sign in</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="usernameOrEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username or email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                disabled={signIn.status === "executing"}
                className="w-full"
              >
                Sign in
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
