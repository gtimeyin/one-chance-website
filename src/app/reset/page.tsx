import Navbar from "@/components/layout/Navbar";
import Breadcrumb from "@/components/layout/Breadcrumb";
import FooterShop from "@/components/layout/FooterShop";
import SmoothScroll from "@/components/SmoothScroll";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import Link from "next/link";

export const metadata = {
  title: "Set New Password",
  description: "Set a new password for your One Chance account.",
  robots: { index: false, follow: true },
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="flex flex-col w-full min-h-screen" style={{ background: "white" }}>
      <SmoothScroll />
      <Navbar />
      <div
        className="relative z-[1] flex flex-col"
        style={{ paddingTop: 24, background: "white", minHeight: "calc(100vh - 96px)" }}
      >
        <div style={{ padding: "0 clamp(20px, 4vw, 40px)" }}>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Sign In", href: "/login" },
              { label: "Set New Password" },
            ]}
          />
        </div>

        <section
          className="flex w-full flex-1 flex-col items-center justify-center bg-white"
          style={{
            paddingTop: "clamp(24px, 4vw, 48px)",
            paddingInline: 24,
            paddingBottom: "calc(clamp(24px, 4vw, 48px) + 160px)",
          }}
        >
          <div className="flex w-full max-w-[440px] flex-col items-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <h1 className="font-['Barlow_Condensed'] text-[48px] mobile:text-[36px] font-[800] leading-[1.1] text-neutral-800 uppercase -tracking-[0.02em]">
                SET NEW PASSWORD
              </h1>
              <p className="font-['Barlow_Condensed'] text-[16px] text-neutral-500 text-center">
                Choose a new password for your account
              </p>
            </div>
            {token ? (
              <ResetPasswordForm token={token} />
            ) : (
              <div className="w-full bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-[14px] font-['Barlow'] text-center">
                This reset link is missing or invalid.{" "}
                <Link href="/forgot" className="underline font-[600]">
                  Request a new one
                </Link>
                .
              </div>
            )}
          </div>
        </section>
      </div>
      <FooterShop reveal />
    </div>
  );
}
