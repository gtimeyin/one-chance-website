"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

interface CheckoutClientProps {
  country: string;
  currency: string;
  publishableKey: string;
}

interface ShippingOption {
  zone_id: number;
  zone_name: string;
  method_id: string;
  instance_id: number;
  title: string;
  cost: number;
}

interface AddressState {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

export default function CheckoutClient({ country, currency, publishableKey }: CheckoutClientProps) {
  const items = useCart((s) => s.items);
  const getTotal = useCart((s) => s.getTotal);
  const router = useRouter();

  const [address, setAddress] = useState<AddressState>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address_1: "",
    address_2: "",
    city: "",
    state: "",
    postcode: "",
    country,
  });
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<ShippingOption | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const c = address.country.trim().toUpperCase();
    if (c.length !== 2) return;
    setShippingLoading(true);
    setSelectedMethod(null);
    fetch(`/api/checkout/shipping-options?country=${c}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const opts: ShippingOption[] = data.options ?? [];
        setShippingOptions(opts);
        if (opts.length > 0) setSelectedMethod(opts[0]);
      })
      .catch(() => {
        if (!cancelled) setShippingOptions([]);
      })
      .finally(() => {
        if (!cancelled) setShippingLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [address.country]);

  const subtotal = getTotal();
  const shippingCost = selectedMethod?.cost ?? 0;
  const total = subtotal + shippingCost;

  function field(key: keyof AddressState, value: string) {
    setAddress((a) => ({ ...a, [key]: value }));
  }

  function validate(): string | null {
    if (items.length === 0) return "Your cart is empty.";
    if (!address.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) return "Enter a valid email.";
    if (!address.first_name.trim()) return "First name is required.";
    if (!address.last_name.trim()) return "Last name is required.";
    if (!address.phone.trim()) return "Phone is required.";
    if (!address.address_1.trim()) return "Address is required.";
    if (!address.city.trim()) return "City is required.";
    if (address.country.length !== 2) return "Country must be a 2-letter ISO code.";
    if (!selectedMethod) return "Select a shipping method.";
    return null;
  }

  async function handleStartPayment() {
    setError(null);
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: address.email.trim(),
          cart: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            quantity: i.quantity,
            unitPrice: i.price,
            ...(i.variationId ? { variationId: i.variationId } : {}),
            image: i.image,
          })),
          shippingAddress: {
            first_name: address.first_name.trim(),
            last_name: address.last_name.trim(),
            address_1: address.address_1.trim(),
            address_2: address.address_2.trim() || undefined,
            city: address.city.trim(),
            state: address.state.trim() || undefined,
            postcode: address.postcode.trim() || undefined,
            country: address.country.trim().toUpperCase(),
            phone: address.phone.trim(),
          },
          shippingMethod: selectedMethod,
          currency,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Couldn't start checkout. Please try again.");
        return;
      }
      setSessionId(data.sessionId);
      setClientSecret(data.clientSecret);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0 && !clientSecret) {
    return (
      <section style={{ padding: "clamp(60px, 8vw, 120px) clamp(20px, 4vw, 60px)" }}>
        <div className="mx-auto" style={{ maxWidth: 720 }}>
          <h1 className="font-barlow-condensed font-extrabold uppercase" style={{ fontSize: "clamp(28px, 4vw, 40px)", color: "var(--color-dark)" }}>
            Your cart is empty
          </h1>
          <p className="font-barlow-condensed" style={{ fontSize: 16, color: "var(--color-text-muted)", marginTop: 12 }}>
            Add something to your cart, then come back.
          </p>
          <button
            type="button"
            onClick={() => router.push("/shop")}
            className="font-barlow-condensed font-bold uppercase cursor-pointer"
            style={{
              marginTop: 24,
              padding: "12px 20px",
              background: "var(--color-yellow)",
              color: "var(--color-dark)",
              fontSize: 14,
              letterSpacing: "0.05em",
              border: "none",
            }}
          >
            Back to Shop
          </button>
        </div>
      </section>
    );
  }

  return (
    <section style={{ padding: "clamp(40px, 6vw, 80px) clamp(20px, 4vw, 60px)" }}>
      <div
        className="mx-auto grid grid-cols-1 lg:grid-cols-[1.4fr_1fr]"
        style={{ maxWidth: 1080, gap: "clamp(28px, 4vw, 56px)" }}
      >
        <div className="flex flex-col" style={{ gap: 28 }}>
          <h1
            className="font-barlow-condensed font-extrabold uppercase"
            style={{ fontSize: "clamp(32px, 4vw, 48px)", color: "var(--color-dark)", lineHeight: 1, letterSpacing: "-1px" }}
          >
            Checkout
          </h1>

          {!clientSecret ? (
            <AddressAndShipping
              address={address}
              setField={field}
              shippingOptions={shippingOptions}
              shippingLoading={shippingLoading}
              selectedMethod={selectedMethod}
              setSelectedMethod={setSelectedMethod}
              currency={currency}
              onSubmit={handleStartPayment}
              submitting={submitting}
              error={error}
            />
          ) : (
            <PaymentStep
              publishableKey={publishableKey}
              clientSecret={clientSecret}
              sessionId={sessionId!}
              router={router}
            />
          )}
        </div>

        <CheckoutSummary
          items={items.map((i) => ({
            id: i.id,
            name: i.name,
            quantity: i.quantity,
            price: i.price,
            image: i.image,
          }))}
          shippingTitle={selectedMethod?.title ?? null}
          shippingCost={shippingCost}
          subtotal={subtotal}
          total={total}
          currency={currency}
        />
      </div>
    </section>
  );
}

interface AddressAndShippingProps {
  address: AddressState;
  setField: (key: keyof AddressState, value: string) => void;
  shippingOptions: ShippingOption[];
  shippingLoading: boolean;
  selectedMethod: ShippingOption | null;
  setSelectedMethod: (m: ShippingOption) => void;
  currency: string;
  onSubmit: () => void;
  submitting: boolean;
  error: string | null;
}

function AddressAndShipping({
  address,
  setField,
  shippingOptions,
  shippingLoading,
  selectedMethod,
  setSelectedMethod,
  currency,
  onSubmit,
  submitting,
  error,
}: AddressAndShippingProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex flex-col"
      style={{ gap: 24 }}
    >
      <section className="flex flex-col" style={{ gap: 14 }}>
        <SectionHeading>Contact</SectionHeading>
        <Field label="Email" type="email" value={address.email} onChange={(v) => setField("email", v)} required />
        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 14 }}>
          <Field label="First name" value={address.first_name} onChange={(v) => setField("first_name", v)} required />
          <Field label="Last name" value={address.last_name} onChange={(v) => setField("last_name", v)} required />
        </div>
        <Field label="Phone" type="tel" value={address.phone} onChange={(v) => setField("phone", v)} required />
      </section>

      <section className="flex flex-col" style={{ gap: 14 }}>
        <SectionHeading>Shipping address</SectionHeading>
        <Field label="Address" value={address.address_1} onChange={(v) => setField("address_1", v)} required />
        <Field label="Apartment, suite, etc. (optional)" value={address.address_2} onChange={(v) => setField("address_2", v)} />
        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 14 }}>
          <Field label="City" value={address.city} onChange={(v) => setField("city", v)} required />
          <Field label="State / region" value={address.state} onChange={(v) => setField("state", v)} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 14 }}>
          <Field label="Postcode" value={address.postcode} onChange={(v) => setField("postcode", v)} />
          <Field
            label="Country (ISO-2)"
            value={address.country}
            onChange={(v) => setField("country", v.toUpperCase())}
            maxLength={2}
            required
          />
        </div>
      </section>

      <section className="flex flex-col" style={{ gap: 14 }}>
        <SectionHeading>Shipping method</SectionHeading>
        {shippingLoading ? (
          <p className="font-barlow-condensed" style={{ fontSize: 14, color: "var(--color-text-muted)" }}>
            Loading shipping options…
          </p>
        ) : shippingOptions.length === 0 ? (
          <p
            className="font-barlow-condensed"
            style={{ fontSize: 14, color: "#B91C1C", padding: "10px 14px", background: "#FEE2E2", borderRadius: 4 }}
          >
            No shipping methods available for {address.country.toUpperCase()}. Try a different country or contact us.
          </p>
        ) : (
          <div className="flex flex-col" style={{ gap: 8 }}>
            {shippingOptions.map((opt) => {
              const id = `ship-${opt.zone_id}-${opt.instance_id}`;
              const isSelected = selectedMethod?.instance_id === opt.instance_id && selectedMethod?.zone_id === opt.zone_id;
              return (
                <label
                  key={id}
                  htmlFor={id}
                  className="flex items-center cursor-pointer font-barlow-condensed"
                  style={{
                    padding: "12px 16px",
                    border: `1px solid ${isSelected ? "var(--color-dark)" : "var(--color-border-light)"}`,
                    background: isSelected ? "#FFFBE6" : "white",
                    borderRadius: 4,
                    gap: 12,
                  }}
                >
                  <input
                    id={id}
                    type="radio"
                    name="shipping_method"
                    checked={isSelected}
                    onChange={() => setSelectedMethod(opt)}
                    style={{ accentColor: "var(--color-dark)" }}
                  />
                  <span className="flex-1" style={{ fontSize: 15, color: "var(--color-dark)" }}>
                    {opt.title}
                  </span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "var(--color-dark)" }}>
                    {opt.cost === 0 ? "Free" : formatPrice(opt.cost, currency)}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </section>

      {error && (
        <p
          className="font-barlow-condensed"
          style={{ fontSize: 14, color: "#B91C1C", padding: "10px 14px", background: "#FEE2E2", borderRadius: 4 }}
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || !selectedMethod}
        className="font-barlow-condensed font-bold uppercase cursor-pointer border-none"
        style={{
          padding: "16px 24px",
          background: submitting || !selectedMethod ? "#E5E7EB" : "#FFD600",
          color: "var(--color-dark)",
          fontSize: 16,
          letterSpacing: "0.05em",
          cursor: submitting || !selectedMethod ? "default" : "pointer",
        }}
      >
        {submitting ? "Starting…" : "Continue to payment"}
      </button>
    </form>
  );
}

interface PaymentStepProps {
  publishableKey: string;
  clientSecret: string;
  sessionId: string;
  router: ReturnType<typeof useRouter>;
}

function PaymentStep({ publishableKey, clientSecret, sessionId, router }: PaymentStepProps) {
  const stripePromise = useMemo<Promise<Stripe | null>>(
    () => loadStripe(publishableKey),
    [publishableKey],
  );
  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret, appearance: { theme: "stripe" } }}
    >
      <PaymentForm sessionId={sessionId} router={router} />
    </Elements>
  );
}

function PaymentForm({ sessionId, router }: { sessionId: string; router: ReturnType<typeof useRouter> }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);

    // Confirm the payment client-side. `redirect: "if_required"` keeps
    // synchronous card flows on-page; 3DS/wallet flows will redirect away
    // and return via the `return_url` (which we then handle on /checkout).
    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: `${window.location.origin}/checkout?session=${sessionId}`,
      },
    });

    if (confirmError) {
      setError(confirmError.message ?? "Card declined. Please try another method.");
      setSubmitting(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      const res = await fetch("/api/checkout/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Order creation failed. Contact support.");
        setSubmitting(false);
        return;
      }
      router.push(`/order-complete?order=${data.orderId}&key=${data.orderKey}`);
      return;
    }

    // PaymentIntent is in a non-terminal state (e.g. requires action). Stripe
    // will have redirected via return_url; if we end up here, it's an
    // unexpected status — surface it.
    setError(`Payment status: ${paymentIntent?.status ?? "unknown"}`);
    setSubmitting(false);
  }

  return (
    <form onSubmit={handlePay} className="flex flex-col" style={{ gap: 20 }}>
      <SectionHeading>Payment</SectionHeading>
      <PaymentElement />
      {error && (
        <p
          className="font-barlow-condensed"
          style={{ fontSize: 14, color: "#B91C1C", padding: "10px 14px", background: "#FEE2E2", borderRadius: 4 }}
        >
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={!stripe || submitting}
        className="font-barlow-condensed font-bold uppercase cursor-pointer border-none"
        style={{
          padding: "16px 24px",
          background: !stripe || submitting ? "#E5E7EB" : "#FFD600",
          color: "var(--color-dark)",
          fontSize: 16,
          letterSpacing: "0.05em",
          cursor: !stripe || submitting ? "default" : "pointer",
        }}
      >
        {submitting ? "Processing…" : "Pay now"}
      </button>
    </form>
  );
}

interface CheckoutSummaryProps {
  items: { id: number; name: string; quantity: number; price: number; image: string }[];
  shippingTitle: string | null;
  shippingCost: number;
  subtotal: number;
  total: number;
  currency: string;
}

function CheckoutSummary({ items, shippingTitle, shippingCost, subtotal, total, currency }: CheckoutSummaryProps) {
  return (
    <aside
      className="flex flex-col h-fit"
      style={{
        padding: "clamp(20px, 3vw, 28px)",
        border: "1px solid var(--color-border-light)",
        gap: 20,
        position: "sticky",
        top: 80,
      }}
    >
      <h2
        className="font-barlow-condensed font-bold uppercase"
        style={{ fontSize: 14, color: "var(--color-text-muted)", letterSpacing: "0.05em" }}
      >
        Order Summary
      </h2>
      <div className="flex flex-col" style={{ gap: 16 }}>
        {items.map((item) => (
          <div key={item.id} className="flex items-center" style={{ gap: 12 }}>
            {item.image ? (
              // Using an <img> here instead of next/image because cart-line
              // images come from arbitrary remote sources (Woo, placeholders).
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.image}
                alt={item.name}
                style={{ width: 56, height: 56, objectFit: "contain", background: "var(--color-light-bg)" }}
              />
            ) : null}
            <div className="flex-1 flex flex-col" style={{ gap: 2 }}>
              <span className="font-barlow-condensed font-bold" style={{ fontSize: 15, color: "var(--color-dark)" }}>
                {item.name}
              </span>
              <span className="font-barlow-condensed" style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                Qty {item.quantity}
              </span>
            </div>
            <span className="font-barlow-condensed font-bold" style={{ fontSize: 14, color: "var(--color-dark)" }}>
              {formatPrice(item.price * item.quantity, currency)}
            </span>
          </div>
        ))}
      </div>
      <div style={{ height: 1, background: "var(--color-border-light)" }} />
      <div className="flex flex-col" style={{ gap: 8 }}>
        <SummaryRow label="Subtotal" value={formatPrice(subtotal, currency)} />
        <SummaryRow
          label={shippingTitle ? `Shipping (${shippingTitle})` : "Shipping"}
          value={shippingCost === 0 ? "Free" : formatPrice(shippingCost, currency)}
        />
        <div style={{ height: 1, background: "var(--color-border-light)", margin: "4px 0" }} />
        <SummaryRow label="Total" value={formatPrice(total, currency)} bold />
      </div>
    </aside>
  );
}

function SummaryRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span
        className="font-barlow-condensed"
        style={{ fontSize: bold ? 16 : 14, color: bold ? "var(--color-dark)" : "var(--color-text-muted)", fontWeight: bold ? 700 : 400 }}
      >
        {label}
      </span>
      <span
        className="font-barlow-condensed"
        style={{ fontSize: bold ? 20 : 14, color: "var(--color-dark)", fontWeight: bold ? 700 : 500 }}
      >
        {value}
      </span>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-barlow-condensed font-bold uppercase"
      style={{ fontSize: 14, color: "var(--color-text-muted)", letterSpacing: "0.05em" }}
    >
      {children}
    </h2>
  );
}

interface FieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  maxLength?: number;
}

function Field({ label, type = "text", value, onChange, required, maxLength }: FieldProps) {
  const id = `f-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className="flex flex-col" style={{ gap: 6 }}>
      <label htmlFor={id} className="font-barlow-condensed" style={{ fontSize: 13, color: "var(--color-dark)" }}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        maxLength={maxLength}
        className="font-barlow-condensed"
        style={{
          padding: "12px 14px",
          border: "1px solid var(--color-border-light)",
          borderRadius: 4,
          fontSize: 14,
          color: "var(--color-dark)",
        }}
      />
    </div>
  );
}
