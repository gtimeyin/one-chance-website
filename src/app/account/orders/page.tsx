import { verifySession } from "@/lib/dal";
import { getCustomerOrders } from "@/lib/woocommerce";
import Link from "next/link";

export default async function OrdersPage() {
  const session = await verifySession();
  const orders = await getCustomerOrders(session.customerId);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-['Barlow_Condensed'] text-[40px] mobile:text-[32px] font-[800] leading-[1.1] text-neutral-800 uppercase -tracking-[0.02em]">
        YOUR ORDERS
      </h1>

      {orders.length === 0 ? (
        <p className="font-['Barlow'] text-[15px] text-neutral-500">
          You haven&apos;t placed any orders yet.{" "}
          <Link href="/shop" className="text-[#fccd21] font-[600] underline">
            Browse the shop
          </Link>
        </p>
      ) : (
        <div className="flex flex-col border border-neutral-200">
          {/* Header — desktop only */}
          <div className="hidden md:flex items-center px-5 py-3 bg-neutral-50 border-b border-neutral-200">
            <span className="flex-1 font-['Barlow_Condensed'] text-[12px] font-[600] uppercase tracking-[0.1em] text-neutral-500">Order</span>
            <span className="w-[120px] font-['Barlow_Condensed'] text-[12px] font-[600] uppercase tracking-[0.1em] text-neutral-500">Date</span>
            <span className="w-[100px] font-['Barlow_Condensed'] text-[12px] font-[600] uppercase tracking-[0.1em] text-neutral-500">Status</span>
            <span className="w-[100px] text-right font-['Barlow_Condensed'] text-[12px] font-[600] uppercase tracking-[0.1em] text-neutral-500">Total</span>
          </div>
          {orders.map((order) => {
            const dateStr = new Date(order.date_created).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
            const statusClass =
              order.status === "completed"
                ? "bg-green-100 text-green-700"
                : order.status === "processing"
                ? "bg-blue-100 text-blue-700"
                : "bg-neutral-100 text-neutral-600";

            return (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex items-center px-5 py-4 border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50 transition-colors no-underline mobile:flex-col mobile:items-stretch mobile:gap-3 mobile:px-4"
                style={{ textDecoration: "none" }}
              >
                {/* Mobile-only top row: order # + total */}
                <div className="hidden mobile:flex items-center justify-between gap-3">
                  <span className="font-['Barlow_Condensed'] text-[16px] font-[700] text-neutral-800">
                    #{order.id}
                  </span>
                  <span className="font-['Barlow_Condensed'] text-[15px] font-[700] text-neutral-800">
                    {order.currency} {order.total}
                  </span>
                </div>
                {/* Mobile-only bottom row: status + date */}
                <div className="hidden mobile:flex items-center justify-between gap-3">
                  <span
                    className={`font-['Barlow_Condensed'] text-[12px] font-[600] uppercase px-2 py-1 ${statusClass}`}
                  >
                    {order.status}
                  </span>
                  <span className="font-['Barlow_Condensed'] text-[13px] text-neutral-500">
                    {dateStr}
                  </span>
                </div>
                {/* Desktop columns */}
                <span className="mobile:hidden flex-1 font-['Barlow_Condensed'] text-[15px] font-[600] text-neutral-800">
                  #{order.id}
                </span>
                <span className="mobile:hidden w-[120px] font-['Barlow_Condensed'] text-[14px] text-neutral-500">
                  {dateStr}
                </span>
                <span className="mobile:hidden w-[100px]">
                  <span
                    className={`font-['Barlow_Condensed'] text-[12px] font-[600] uppercase px-2 py-1 ${statusClass}`}
                  >
                    {order.status}
                  </span>
                </span>
                <span className="mobile:hidden w-[100px] text-right font-['Barlow_Condensed'] text-[14px] font-[600] text-neutral-800">
                  {order.currency} {order.total}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
