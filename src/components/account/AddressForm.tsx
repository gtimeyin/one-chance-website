"use client";

import { useActionState } from "react";
import { Button } from "@/ui/components/Button";
import { TextField } from "@/ui/components/TextField";
import type { FormState, WooAddress } from "@/lib/auth-definitions";

const initialState: FormState = {};

export default function AddressForm({
  title,
  address,
  action,
}: {
  title: string;
  address: WooAddress;
  action: (state: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <h2 className="font-['Barlow_Condensed'] text-[24px] font-[700] text-neutral-800 uppercase">
        {title}
      </h2>

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
        <div className="flex-1">
          <TextField label="First Name">
            <TextField.Input name="first_name" defaultValue={address.first_name} placeholder="First name" />
          </TextField>
        </div>
        <div className="flex-1">
          <TextField label="Last Name">
            <TextField.Input name="last_name" defaultValue={address.last_name} placeholder="Last name" />
          </TextField>
        </div>
      </div>

      <TextField label="Address Line 1">
        <TextField.Input name="address_1" defaultValue={address.address_1} placeholder="Street address" />
      </TextField>

      <TextField label="Address Line 2">
        <TextField.Input name="address_2" defaultValue={address.address_2} placeholder="Apartment, suite, etc." />
      </TextField>

      <div className="flex gap-4">
        <div className="flex-1">
          <TextField label="City">
            <TextField.Input name="city" defaultValue={address.city} placeholder="City" />
          </TextField>
        </div>
        <div className="flex-1">
          <TextField label="State">
            <TextField.Input name="state" defaultValue={address.state} placeholder="State / Province" />
          </TextField>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <TextField label="Postcode">
            <TextField.Input name="postcode" defaultValue={address.postcode} placeholder="Postal code" />
          </TextField>
        </div>
        <div className="flex-1">
          <TextField label="Country">
            <TextField.Input name="country" defaultValue={address.country} placeholder="Country" />
          </TextField>
        </div>
      </div>

      <TextField label="Phone">
        <TextField.Input name="phone" type="tel" defaultValue={address.phone || ""} placeholder="Phone number" />
      </TextField>

      <div className="pt-2">
        <Button variant="brand-primary" size="medium" disabled={pending} type="submit">
          {pending ? "Saving..." : "Save Address"}
        </Button>
      </div>
    </form>
  );
}
