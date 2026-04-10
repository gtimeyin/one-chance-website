import { verifySession } from "@/lib/dal";
import { getCustomerById, getCustomerOrders } from "@/lib/woocommerce";
import Link from "next/link";

export default async function AccountDashboard() {
  const session = await verifySession();
  const customer = await getCustomerById(session.customerId);
  const orders = await getCustomerOrders(session.customerId, { per_page: 3 });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-['Barlow_Condensed'] text-[40px] font-[800] leading-[1.1] text-neutral-800 uppercase -tracking-[0.02em]">
          WELCOME{customer ? `, ${customer.first_name.toUpperCase()}` : ""}
        </h1>
        <p className="font-['Barlow'] text-[16px] text-neutral-500">
          Manage your account, view orders, and update your details.
        </p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Orders", desc: "Track and view your orders", href: "/account/orders" },
          { label: "Addresses", desc: "Manage shipping & billing", href: "/account/addresses" },
          { label: "Account Details", desc: "Update your profile", href: "/account/edit" },
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="flex flex-col gap-2 p-5 border border-neutral-200 hover:border-neutral-400 transition-colors no-underline"
            style={{ textDecoration: "none" }}
          >
            <span className="font-['Barlow_Condensed'] text-[20px] font-[700] text-neutral-800 uppercase">
              {card.label}
            </span>
            <span className="font-['Barlow'] text-[14px] text-neutral-500">
              {card.desc}
            </span>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="flex flex-col gap-4">
        <h2 className="font-['Barlow_Condensed'] text-[24px] font-[700] text-neutral-800 uppercase">
          RECENT ORDERS
        </h2>
        {orders.length === 0 ? (
          <p className="font-['Barlow'] text-[15px] text-neutral-500">
            No orders yet.{" "}
            <Link href="/shop" className="text-[#fccd21] font-[600] underline">
              Start shopping
            </Link>
          </p>
        ) : (
          <div className="flex flex-col border border-neutral-200">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50 transition-colors no-underline"
                style={{ textDecoration: "none" }}
              >
                <div className="flex flex-col gap-1">
                  <span className="font-['Barlow'] text-[15px] font-[600] text-neutral-800">
                    Order #{order.id}
                  </span>
                  <span className="font-['Barlow'] text-[13px] text-neutral-400">
                    {new Date(order.date_created).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-['Barlow'] text-[14px] font-[600] text-neutral-800">
                    {order.currency} {order.total}
                  </span>
                  <span
                    className={`font-['Barlow'] text-[12px] font-[600] uppercase px-2 py-1 ${
                      order.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : order.status === "processing"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
