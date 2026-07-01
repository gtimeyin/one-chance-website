"use client";

import { useActionState } from "react";
import { requestPasswordReset } from "@/app/actions/auth";
import { Button } from "@/ui/components/Button";
import { TextField } from "@/ui/components/TextField";
import Link from "next/link";
import type { FormState } from "@/lib/auth-definitions";

const initialState: FormState = {};

export default function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5 w-full">
      {state.message && (
        <div
          className={`px-4 py-3 rounded text-[14px] font-['Barlow'] ${
            state.success
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {state.message}
        </div>
      )}

      <TextField label="Email" error={!!state.errors?.email}>
        <TextField.Input name="email" type="email" placeholder="Enter your email" />
      </TextField>
      {state.errors?.email && (
        <span className="text-red-600 text-[13px] font-['Barlow'] -mt-3">{state.errors.email[0]}</span>
      )}

      <Button variant="brand-primary" size="medium" disabled={pending} type="submit">
        {pending ? "Sending..." : "Send reset link"}
      </Button>

      <p className="font-['Barlow'] text-[14px] text-neutral-500 text-center">
        Remembered it?{" "}
        <Link href="/login" className="text-[#fccd21] font-[600] underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
