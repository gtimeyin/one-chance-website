"use client";

import { useActionState } from "react";
import { register } from "@/app/actions/auth";
import { Button } from "@/ui/components/Button";
import { TextField } from "@/ui/components/TextField";
import Link from "next/link";
import type { FormState } from "@/lib/auth-definitions";
import ReferralCodeInput from "@/components/referral/ReferralCodeInput";

const initialState: FormState = {};

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState(register, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5 w-full">
      {state.message && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-[14px] font-['Barlow']">
          {state.message}
        </div>
      )}

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-1">
          <TextField label="First Name" error={!!state.errors?.firstName}>
            <TextField.Input
              name="firstName"
              type="text"
              placeholder="First name"
            />
          </TextField>
          {state.errors?.firstName && (
            <span className="text-red-600 text-[13px] font-['Barlow']">{state.errors.firstName[0]}</span>
          )}
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <TextField label="Last Name" error={!!state.errors?.lastName}>
            <TextField.Input
              name="lastName"
              type="text"
              placeholder="Last name"
            />
          </TextField>
          {state.errors?.lastName && (
            <span className="text-red-600 text-[13px] font-['Barlow']">{state.errors.lastName[0]}</span>
          )}
        </div>
      </div>

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
          placeholder="At least 6 characters"
        />
      </TextField>
      {state.errors?.password && (
        <span className="text-red-600 text-[13px] font-['Barlow'] -mt-3">{state.errors.password[0]}</span>
      )}

      <TextField label="Confirm Password" error={!!state.errors?.confirmPassword}>
        <TextField.Input
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
        />
      </TextField>
      {state.errors?.confirmPassword && (
        <span className="text-red-600 text-[13px] font-['Barlow'] -mt-3">{state.errors.confirmPassword[0]}</span>
      )}

      <ReferralCodeInput />

      <Button
        variant="brand-primary"
        size="medium"
        disabled={pending}
        onClick={() => {}}
      >
        {pending ? "Creating account..." : "Create Account"}
      </Button>

      <p className="font-['Barlow'] text-[14px] text-neutral-500 text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-[#fccd21] font-[600] underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
