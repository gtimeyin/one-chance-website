"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";

const navItems = [
  { label: "Dashboard", href: "/account" },
  { label: "Orders", href: "/account/orders" },
  { label: "Addresses", href: "/account/addresses" },
  { label: "Referrals", href: "/account/referrals" },
  { label: "Account Details", href: "/account/edit" },
];

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 w-[220px] shrink-0 mobile:hidden">
      {navItems.map((item) => {
        const isActive =
          item.href === "/account"
            ? pathname === "/account"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`font-['Barlow'] text-[15px] font-[500] px-4 py-3 no-underline transition-colors duration-200 ${
              isActive
                ? "text-neutral-900 bg-neutral-100 font-[600]"
                : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50"
            }`}
            style={{ textDecoration: "none" }}
          >
            {item.label}
          </Link>
        );
      })}
      <form action={logout}>
        <button
          type="submit"
          className="w-full text-left font-['Barlow'] text-[15px] font-[500] px-4 py-3 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors duration-200 cursor-pointer bg-transparent border-none"
        >
          Sign Out
        </button>
      </form>
    </nav>
  );
}
