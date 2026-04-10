import { verifySession } from "@/lib/dal";
import { getOrderById } from "@/lib/woocommerce";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await verifySession();
  const { id } = await params;
  const order = await getOrderById(parseInt(id, 10));

  if (!order) notFound();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link
          href="/account/orders"
          className="font-['Barlow'] text-[14px] text-neutral-400 hover:text-neutral-600 no-underline"
          style={{ textDecoration: "none" }}
        >
          &larr; Back to Orders
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="font-['Barlow_Condensed'] text-[36px] font-[800] leading-[1.1] text-neutral-800 uppercase">
          ORDER #{order.id}
        </h1>
        <div className="flex items-center gap-3">
          <span className="font-['Barlow'] text-[14px] text-neutral-500">
            {new Date(order.date_created).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
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
      </div>

      {/* Line items */}
      <div className="flex flex-col border border-neutral-200">
        <div className="flex items-center px-5 py-3 bg-neutral-50 border-b border-neutral-200">
          <span className="flex-1 font-['Barlow'] text-[12px] font-[600] uppercase tracking-[0.1em] text-neutral-500">Product</span>
          <span className="w-[60px] text-center font-['Barlow'] text-[12px] font-[600] uppercase tracking-[0.1em] text-neutral-500">Qty</span>
          <span className="w-[100px] text-right font-['Barlow'] text-[12px] font-[600] uppercase tracking-[0.1em] text-neutral-500">Total</span>
        </div>
        {order.line_items.map((item) => (
          <div
            key={item.id}
            className="flex items-center px-5 py-4 border-b border-neutral-100 last:border-b-0"
          >
            <span className="flex-1 font-['Barlow'] text-[15px] text-neutral-800">
              {item.name}
            </span>
            <span className="w-[60px] text-center font-['Barlow'] text-[14px] text-neutral-500">
              {item.quantity}
            </span>
            <span className="w-[100px] text-right font-['Barlow'] text-[14px] font-[600] text-neutral-800">
              {order.currency} {item.total}
            </span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-8">
          <span className="font-['Barlow'] text-[14px] text-neutral-500">Shipping</span>
          <span className="font-['Barlow'] text-[14px] font-[600] text-neutral-800">
            {order.currency} {order.shipping_total}
          </span>
        </div>
        <div className="flex items-center gap-8">
          <span className="font-['Barlow'] text-[16px] font-[700] text-neutral-800">Total</span>
          <span className="font-['Barlow'] text-[20px] font-[700] text-neutral-800">
            {order.currency} {order.total}
          </span>
        </div>
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <h3 className="font-['Barlow_Condensed'] text-[18px] font-[700] text-neutral-800 uppercase">
            Billing Address
          </h3>
          <p className="font-['Barlow'] text-[14px] text-neutral-600 leading-[1.6]">
            {order.billing.first_name} {order.billing.last_name}<br />
            {order.billing.address_1}<br />
            {order.billing.address_2 && <>{order.billing.address_2}<br /></>}
            {order.billing.city}, {order.billing.state} {order.billing.postcode}<br />
            {order.billing.country}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-['Barlow_Condensed'] text-[18px] font-[700] text-neutral-800 uppercase">
            Shipping Address
          </h3>
          <p className="font-['Barlow'] text-[14px] text-neutral-600 leading-[1.6]">
            {order.shipping.first_name} {order.shipping.last_name}<br />
            {order.shipping.address_1}<br />
            {order.shipping.address_2 && <>{order.shipping.address_2}<br /></>}
            {order.shipping.city}, {order.shipping.state} {order.shipping.postcode}<br />
            {order.shipping.country}
          </p>
        </div>
      </div>
    </div>
  );
}
