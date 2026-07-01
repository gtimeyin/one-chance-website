"use client";

import { useActionState } from "react";
import { changePassword } from "@/app/actions/account";
import { Button } from "@/ui/components/Button";
import { TextField } from "@/ui/components/TextField";
import type { FormState } from "@/lib/auth-definitions";

const initialState: FormState = {};

export default function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePassword, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5 max-w-[520px]">
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

      <TextField label="Current Password" error={!!state.errors?.currentPassword}>
        <TextField.Input name="currentPassword" type="password" placeholder="Enter current password" />
      </TextField>
      {state.errors?.currentPassword && (
        <span className="text-red-600 text-[13px] font-['Barlow'] -mt-3">{state.errors.currentPassword[0]}</span>
      )}

      <TextField label="New Password" error={!!state.errors?.newPassword}>
        <TextField.Input name="newPassword" type="password" placeholder="At least 8 characters" />
      </TextField>
      {state.errors?.newPassword && (
        <span className="text-red-600 text-[13px] font-['Barlow'] -mt-3">{state.errors.newPassword[0]}</span>
      )}

      <TextField label="Confirm New Password" error={!!state.errors?.confirmPassword}>
        <TextField.Input name="confirmPassword" type="password" placeholder="Re-enter your new password" />
      </TextField>
      {state.errors?.confirmPassword && (
        <span className="text-red-600 text-[13px] font-['Barlow'] -mt-3">{state.errors.confirmPassword[0]}</span>
      )}

      <div className="pt-2">
        <Button variant="brand-primary" size="medium" disabled={pending} type="submit">
          {pending ? "Updating..." : "Update Password"}
        </Button>
      </div>
    </form>
  );
}
