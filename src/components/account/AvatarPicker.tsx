"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { CHARACTER_AVATARS, type AvatarId } from "@/lib/avatar-options";
import { updateAvatar } from "@/app/actions/account";

interface Props {
  currentAvatarId: AvatarId;
}

export default function AvatarPicker({ currentAvatarId }: Props) {
  const [selected, setSelected] = useState<AvatarId>(currentAvatarId);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ text: string; success: boolean } | null>(null);

  const handleSelect = (id: AvatarId) => {
    setSelected(id);
    setMessage(null);

    startTransition(async () => {
      const result = await updateAvatar(id);
      setMessage({
        text: result.message || "",
        success: result.success || false,
      });
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <span className="font-['Barlow_Condensed'] text-[20px] font-[700] text-neutral-800 uppercase">
          Choose Your Character
        </span>
        <span className="font-['Barlow'] text-[14px] text-neutral-500">
          Select a One Chance character as your avatar
        </span>
      </div>

      {message && (
        <div
          className={`px-4 py-2 text-[13px] font-['Barlow'] ${
            message.success
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
        {CHARACTER_AVATARS.map((avatar) => (
          <button
            key={avatar.id}
            onClick={() => handleSelect(avatar.id)}
            disabled={isPending}
            className={`flex flex-col items-center gap-2 p-2 border-2 cursor-pointer bg-transparent transition-all ${
              selected === avatar.id
                ? "border-[#FFD600] bg-yellow-50"
                : "border-transparent hover:border-neutral-300"
            } ${isPending ? "opacity-50" : ""}`}
          >
            <div className="relative w-16 h-16 overflow-hidden rounded-full">
              <Image
                src={avatar.src}
                alt={avatar.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <span className="font-['Barlow'] text-[11px] font-[600] text-neutral-600 text-center leading-tight">
              {avatar.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
