import { verifySession } from "@/lib/dal";
import { getCustomerById } from "@/lib/woocommerce";
import { getUserAvatar } from "@/lib/avatars";
import ProfileForm from "@/components/account/ProfileForm";
import AvatarPicker from "@/components/account/AvatarPicker";

export default async function EditProfilePage() {
  const session = await verifySession();
  const [customer, avatarId] = await Promise.all([
    getCustomerById(session.customerId),
    getUserAvatar(session.customerId),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-['Barlow_Condensed'] text-[40px] font-[800] leading-[1.1] text-neutral-800 uppercase -tracking-[0.02em]">
        ACCOUNT DETAILS
      </h1>
      <AvatarPicker currentAvatarId={avatarId} />
      <div className="border-t border-neutral-200 pt-6">
        <ProfileForm
          firstName={customer?.first_name || ""}
          lastName={customer?.last_name || ""}
          email={customer?.email || session.email}
        />
      </div>
    </div>
  );
}
