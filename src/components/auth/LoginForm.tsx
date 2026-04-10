"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import { Button } from "@/ui/components/Button";
import { TextField } from "@/ui/components/TextField";
import Link from "next/link";
import type { FormState } from "@/lib/auth-definitions";

const initialState: FormState = {};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5 w-full">
      {state.message && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-[14px] font-['Barlow']">
          {state.message}
        </div>
      )}

      <TextField label="Email" error={!!state.errors?.email}>
        <TextField.Input
          name="email"
          type="email"
          placeholder="Enter your email"
        />
      </TextField>
      {state.errors?.email && (
        <span className="text-red-600 text-[13px] font-['Barlow'] -mt-3">{state.errors.email[0]}</span>
      )}

      <TextField label="Password" error={!!state.errors?.password}>
        <TextField.Input
          name="password"
          type="password"
          placeholder="Enter your password"
        />
      </TextField>
      {state.errors?.password && (
        <span className="text-red-600 text-[13px] font-['Barlow'] -mt-3">{state.errors.password[0]}</span>
      )}

      <Button
        variant="brand-primary"
        size="medium"
        disabled={pending}
        onClick={() => {}}
      >
        {pending ? "Signing in..." : "Sign In"}
      </Button>

      <p className="font-['Barlow'] text-[14px] text-neutral-500 text-center">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-[#fccd21] font-[600] underline">
          Create one
        </Link>
      </p>
    </form>
  );
}
