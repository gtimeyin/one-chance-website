import "server-only";
import { getSupabaseClient } from "./supabase";
import { createLogger } from "./logger";
import { CHARACTER_AVATARS, type AvatarId } from "./avatar-options";

export type { AvatarId };
export { CHARACTER_AVATARS, getAvatarById } from "./avatar-options";

const log = createLogger("avatars");

export function getRandomAvatarId(): AvatarId {
  const index = Math.floor(Math.random() * CHARACTER_AVATARS.length);
  return CHARACTER_AVATARS[index].id;
}

export async function getUserAvatar(wooCustomerId: number): Promise<AvatarId> {
  const supabase = getSupabaseClient();
  if (!supabase) return CHARACTER_AVATARS[0].id;

  const { data, error } = await supabase
    .from("user_avatars")
    .select("avatar")
    .eq("woo_customer_id", wooCustomerId)
    .single();

  if (error || !data) {
    return CHARACTER_AVATARS[0].id;
  }

  return data.avatar as AvatarId;
}

export async function setUserAvatar(
  wooCustomerId: number,
  avatarId: AvatarId
): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  const { error } = await supabase
    .from("user_avatars")
    .upsert(
      {
        woo_customer_id: wooCustomerId,
        avatar: avatarId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "woo_customer_id" }
    );

  if (error) {
    log.error("Failed to set user avatar", error);
    return false;
  }

  return true;
}
