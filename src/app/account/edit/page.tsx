import { verifySession } from "@/lib/dal";
import { getCustomerById } from "@/lib/woocommerce";
import ProfileForm from "@/components/account/ProfileForm";

export default async function EditProfilePage() {
  const session = await verifySession();
  const customer = await getCustomerById(session.customerId);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-['Barlow_Condensed'] text-[40px] font-[800] leading-[1.1] text-neutral-800 uppercase -tracking-[0.02em]">
        ACCOUNT DETAILS
      </h1>
      <ProfileForm
        firstName={customer?.first_name || ""}
        lastName={customer?.last_name || ""}
        email={customer?.email || session.email}
      />
    </div>
  );
}
