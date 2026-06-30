import Navbar from "@/components/layout/Navbar";
import Breadcrumb from "@/components/layout/Breadcrumb";
import FooterShop from "@/components/layout/FooterShop";
import SmoothScroll from "@/components/SmoothScroll";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Sign In",
  description: "Sign in to your One Chance account.",
  robots: { index: false, follow: true },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  const redirectTo =
    redirect && redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : undefined;
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
              { label: "Sign In" },
            ]}
          />
        </div>

        <section
          className="flex w-full flex-1 flex-col items-center justify-center bg-white"
          style={{
            paddingTop: "clamp(24px, 4vw, 48px)",
            paddingInline: 24,
            // Heavier bottom padding offsets the header stack (top bar +
            // breadcrumb) above the section, so justify-center lands the form
            // on the viewport's optical centre, not below it.
            paddingBottom: "calc(clamp(24px, 4vw, 48px) + 160px)",
          }}
        >
          <div className="flex w-full max-w-[440px] flex-col items-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <h1 className="font-['Barlow_Condensed'] text-[48px] mobile:text-[36px] font-[800] leading-[1.1] text-neutral-800 uppercase -tracking-[0.02em]">
                SIGN IN
              </h1>
              <p className="font-['Barlow_Condensed'] text-[16px] text-neutral-500 text-center">
                Access your account, orders, and more
              </p>
            </div>
            <LoginForm redirectTo={redirectTo} />
          </div>
        </section>
      </div>
      <FooterShop reveal />
    </div>
  );
}
