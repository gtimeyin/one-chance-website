"use client";

import { useActionState } from "react";
import { updateProfile } from "@/app/actions/account";
import { Button } from "@/ui/components/Button";
import { TextField } from "@/ui/components/TextField";
import type { FormState } from "@/lib/auth-definitions";

const initialState: FormState = {};

export default function ProfileForm({
  firstName,
  lastName,
  email,
}: {
  firstName: string;
  lastName: string;
  email: string;
}) {
  const [state, formAction, pending] = useActionState(updateProfile, initialState);

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

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-1">
          <TextField label="First Name" error={!!state.errors?.firstName}>
            <TextField.Input name="firstName" defaultValue={firstName} placeholder="First name" />
          </TextField>
          {state.errors?.firstName && (
            <span className="text-red-600 text-[13px] font-['Barlow']">{state.errors.firstName[0]}</span>
          )}
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <TextField label="Last Name" error={!!state.errors?.lastName}>
            <TextField.Input name="lastName" defaultValue={lastName} placeholder="Last name" />
          </TextField>
          {state.errors?.lastName && (
            <span className="text-red-600 text-[13px] font-['Barlow']">{state.errors.lastName[0]}</span>
          )}
        </div>
      </div>

      <TextField label="Email" error={!!state.errors?.email}>
        <TextField.Input name="email" type="email" defaultValue={email} placeholder="Email address" />
      </TextField>
      {state.errors?.email && (
        <span className="text-red-600 text-[13px] font-['Barlow'] -mt-3">{state.errors.email[0]}</span>
      )}

      <div className="pt-2">
        <Button variant="brand-primary" size="medium" disabled={pending} type="submit">
          {pending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
