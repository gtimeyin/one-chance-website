import Navbar from "@/components/layout/Navbar";
import Breadcrumb from "@/components/layout/Breadcrumb";
import FooterShop from "@/components/layout/FooterShop";
import SmoothScroll from "@/components/SmoothScroll";
import AccountSidebar from "@/components/account/AccountSidebar";
import { getOptionalSession } from "@/lib/dal";
import { getUserAvatar, getAvatarById } from "@/lib/avatars";

export const metadata = {
  title: "My Account - One Chance Board Game",
  description: "Manage your One Chance account, orders, and addresses.",
};

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getOptionalSession();
  let avatarSrc = "/loader/2bobo.png";
  let avatarName = "Avatar";
  if (session) {
    const avatarId = await getUserAvatar(session.customerId);
    const avatar = getAvatarById(avatarId);
    avatarSrc = avatar.src;
    avatarName = avatar.name;
  }
  return (
    <div className="flex flex-col w-full" style={{ background: "white" }}>
      <SmoothScroll />
      <Navbar />
      <div style={{ paddingTop: 56 }}>
        <div style={{ padding: "0 clamp(20px, 4vw, 40px)" }}>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "My Account" },
            ]}
          />
        </div>

        <section
          className="flex w-full justify-center bg-white"
          style={{ padding: "clamp(32px, 4vw, 64px) clamp(20px, 4vw, 40px)" }}
        >
          <div className="flex w-full max-w-[1024px] gap-10">
            <AccountSidebar avatarSrc={avatarSrc} avatarName={avatarName} />
            <main className="flex-1 min-w-0">{children}</main>
          </div>
        </section>
      </div>
      <FooterShop />
    </div>
  );
}
