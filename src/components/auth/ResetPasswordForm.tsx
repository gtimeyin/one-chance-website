"use client";

import { useActionState } from "react";
import { resetPassword } from "@/app/actions/auth";
import { Button } from "@/ui/components/Button";
import { TextField } from "@/ui/components/TextField";
import Link from "next/link";
import type { FormState } from "@/lib/auth-definitions";

const initialState: FormState = {};

export default function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(resetPassword, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5 w-full">
      <input type="hidden" name="token" value={token} />
      {state.message && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-[14px] font-['Barlow']">
          {state.message}{" "}
          <Link href="/forgot" className="underline font-[600]">
            Request a new link
          </Link>
        </div>
      )}

      <TextField label="New Password" error={!!state.errors?.password}>
        <TextField.Input name="password" type="password" placeholder="At least 8 characters" />
      </TextField>
      {state.errors?.password && (
        <span className="text-red-600 text-[13px] font-['Barlow'] -mt-3">{state.errors.password[0]}</span>
      )}

      <TextField label="Confirm New Password" error={!!state.errors?.confirmPassword}>
        <TextField.Input name="confirmPassword" type="password" placeholder="Re-enter your new password" />
      </TextField>
      {state.errors?.confirmPassword && (
        <span className="text-red-600 text-[13px] font-['Barlow'] -mt-3">{state.errors.confirmPassword[0]}</span>
      )}

      <Button variant="brand-primary" size="medium" disabled={pending} type="submit">
        {pending ? "Updating..." : "Set new password"}
      </Button>
    </form>
  );
}
