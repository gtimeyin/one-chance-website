"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";

interface NavItem {
  label: string;
  href: string;
  creator?: boolean;
}

const baseNavItems: NavItem[] = [
  { label: "Dashboard", href: "/account" },
  { label: "Orders", href: "/account/orders" },
  { label: "Addresses", href: "/account/addresses" },
  { label: "Referrals", href: "/account/referrals" },
  { label: "Account Details", href: "/account/edit" },
];

const creatorNavItems: NavItem[] = [
  { label: "Comics", href: "/account/admin/comics", creator: true },
];

export default function AccountSidebar({
  avatarSrc,
  avatarName,
  isCreator = false,
}: {
  avatarSrc: string;
  avatarName: string;
  isCreator?: boolean;
}) {
  const pathname = usePathname();
  const navItems: NavItem[] = isCreator
    ? [...baseNavItems, ...creatorNavItems]
    : baseNavItems;

  return (
    <nav
      className="
        flex w-[220px] flex-col gap-1 shrink-0
        mobile:w-full mobile:flex-row mobile:items-center mobile:gap-3 mobile:overflow-x-auto mobile:pb-3 mobile:border-b mobile:border-neutral-200 mobile:[-webkit-overflow-scrolling:touch]
      "
    >
      <Link
        href="/account/edit"
        className="
          flex items-center gap-3 px-4 py-4 mb-2 no-underline group
          mobile:px-0 mobile:py-0 mobile:mb-0 mobile:shrink-0
        "
        style={{ textDecoration: "none" }}
        title="Change avatar"
      >
        <div className="relative w-12 h-12 mobile:w-10 mobile:h-10 overflow-hidden rounded-full border-2 border-[#FFD600] shrink-0">
          <Image
            src={avatarSrc}
            alt={avatarName}
            fill
            className="object-cover"
            sizes="48px"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <span className="font-['Barlow_Condensed'] text-[9px] font-[600] text-white opacity-0 group-hover:opacity-100 transition-opacity uppercase">
              Edit
            </span>
          </div>
        </div>
        <span className="font-['Barlow_Condensed'] text-[15px] font-[700] text-neutral-700 uppercase mobile:hidden">
          {avatarName}
        </span>
      </Link>
      {navItems.map((item) => {
        const isActive =
          item.href === "/account"
            ? pathname === "/account"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`font-['Barlow_Condensed'] text-[15px] font-[500] px-4 py-3 no-underline transition-colors duration-200 mobile:shrink-0 mobile:whitespace-nowrap mobile:py-2 mobile:px-3 mobile:rounded-full mobile:border flex items-center gap-2 ${
              isActive
                ? "text-neutral-900 bg-neutral-100 font-[600] mobile:border-neutral-900"
                : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50 mobile:border-neutral-200"
            }`}
            style={{ textDecoration: "none" }}
          >
            <span>{item.label}</span>
            {item.creator && (
              <span
                className="font-['Barlow_Condensed'] font-[700] uppercase"
                style={{
                  fontSize: 9,
                  letterSpacing: "0.06em",
                  padding: "2px 6px",
                  background: "var(--color-yellow)",
                  color: "var(--color-dark)",
                }}
              >
                Creator
              </span>
            )}
          </Link>
        );
      })}
      <form action={logout} className="mobile:shrink-0">
        <button
          type="submit"
          className="w-full text-left font-['Barlow_Condensed'] text-[15px] font-[500] px-4 py-3 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors duration-200 cursor-pointer bg-transparent border-none mobile:whitespace-nowrap mobile:py-2 mobile:px-3 mobile:rounded-full mobile:border mobile:border-red-200"
        >
          Sign Out
        </button>
      </form>
    </nav>
  );
}
