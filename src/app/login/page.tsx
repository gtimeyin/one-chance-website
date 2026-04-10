import Navbar from "@/components/layout/Navbar";
import Breadcrumb from "@/components/layout/Breadcrumb";
import FooterShop from "@/components/layout/FooterShop";
import SmoothScroll from "@/components/SmoothScroll";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Sign In - One Chance Board Game",
  description: "Sign in to your One Chance account.",
};

export default function LoginPage() {
  return (
    <div className="flex flex-col w-full" style={{ background: "white" }}>
      <SmoothScroll />
      <Navbar />
      <div style={{ paddingTop: 56 }}>
        <div style={{ padding: "0 clamp(20px, 4vw, 40px)" }}>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Sign In" },
            ]}
          />
        </div>

        <section
          className="flex w-full flex-col items-center bg-white"
          style={{ padding: "clamp(48px, 6vw, 96px) 24px" }}
        >
          <div className="flex w-full max-w-[440px] flex-col items-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <h1 className="font-['Barlow_Condensed'] text-[48px] font-[800] leading-[1.1] text-neutral-800 uppercase -tracking-[0.02em]">
                SIGN IN
              </h1>
              <p className="font-['Barlow'] text-[16px] text-neutral-500 text-center">
                Access your account, orders, and more
              </p>
            </div>
            <LoginForm />
          </div>
        </section>
      </div>
      <FooterShop />
    </div>
  );
}
