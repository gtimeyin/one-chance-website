"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
// @paystack/inline-js touches `window` at module scope, which crashes SSR
// even for client components. Lazy-import it from the Paystack branch below.
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { supportedCountries } from "@/lib/currency";

type Provider = "stripe" | "paystack";

// Currencies that Paystack can charge in. Returned in order of preference
// for that currency: the first entry is the default.
function providersForCurrency(currency: string): Provider[] {
  const c = currency.toUpperCase();
  if (c === "NGN") return ["paystack", "stripe"];
  if (c === "KES") return ["paystack", "stripe"];
  if (c === "GHS" || c === "ZAR") return ["paystack"];
  return ["stripe"]; // USD, GBP, EUR — Paystack doesn't natively charge these for Nigerian merchants
}

interface CheckoutClientProps {
  country: string;
  currency: string;
  publishableKey: string;
  initialEmail?: string;
  initialFirstName?: string;
  isAuthenticated?: boolean;
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

export default function CheckoutClient({
  country,
  currency: initialCurrency,
  publishableKey,
  initialEmail = "",
  initialFirstName = "",
  isAuthenticated = false,
}: CheckoutClientProps) {
  const items = useCart((s) => s.items);
  const router = useRouter();

  const [address, setAddress] = useState<AddressState>({
    first_name: initialFirstName,
    last_name: "",
    email: initialEmail,
    phone: "",
    address_1: "",
    address_2: "",
    city: "",
    state: "",
    postcode: "",
    country,
  });
  // Currency + per-item prices come from the server for the active country;
  // they're refreshed when the user changes the country dropdown.
  const [currency, setCurrency] = useState(initialCurrency);
  const [repricedPrices, setRepricedPrices] = useState<
    Record<number, { price: number; regular_price: number; on_sale: boolean }>
  >({});
  const [repricing, setRepricing] = useState(false);
  const availableProviders = providersForCurrency(currency);
  const [provider, setProvider] = useState<Provider>(availableProviders[0]);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The cart's `i.price` was captured in whatever currency was active when
  // the item was added — it's not safe to use after a country switch. We
  // intentionally don't fall back to it; the order summary skeletons until
  // the live reprice arrives, and the submit button is gated below.
  function unitPriceFor(productId: number): number | null {
    return repricedPrices[productId]?.price ?? null;
  }
  function saleInfoFor(productId: number): { regular_price: number; on_sale: boolean } | null {
    const r = repricedPrices[productId];
    if (!r || !r.on_sale || r.regular_price <= r.price) return null;
    return { regular_price: r.regular_price, on_sale: true };
  }
  const allLinesPriced = items.every((i) => repricedPrices[i.productId] != null);
  const subtotal = allLinesPriced
    ? items.reduce((sum, i) => sum + (unitPriceFor(i.productId) ?? 0) * i.quantity, 0)
    : null;

  useEffect(() => {
    // Keep the chosen provider valid as the currency changes (e.g. user
    // edits country to a region where the current provider isn't supported).
    if (!availableProviders.includes(provider)) {
      setProvider(availableProviders[0]);
    }
  }, [availableProviders, provider]);

  useEffect(() => {
    // Reprice the cart when country changes — WCPBC has different prices
    // (and possibly a different currency) per zone. Also persist the
    // country to the oc-country cookie so navigating away from /checkout
    // keeps the same context.
    let cancelled = false;
    const c = address.country.trim().toUpperCase();
    if (c.length !== 2 || items.length === 0) return;

    document.cookie = `oc-country=${c}; path=/; max-age=31536000; samesite=lax`;
    setRepricing(true);
    fetch("/api/checkout/reprice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productIds: Array.from(new Set(items.map((i) => i.productId))),
        country: c,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data?.currency) setCurrency(data.currency);
        if (Array.isArray(data?.prices)) {
          const map: Record<number, { price: number; regular_price: number; on_sale: boolean }> = {};
          for (const p of data.prices) {
            map[p.productId] = {
              price: p.price,
              regular_price: p.regular_price ?? p.price,
              on_sale: Boolean(p.on_sale),
            };
          }
          setRepricedPrices(map);
        }
      })
      .catch(() => { /* keep stale prices */ })
      .finally(() => {
        if (!cancelled) setRepricing(false);
      });
    return () => {
      cancelled = true;
    };
  }, [address.country, items]);

  const total = subtotal;

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
    return null;
  }

  function buildPayload() {
    // Server is now the authority on prices + currency — it looks them up
    // by productId and country. Anything else is window dressing.
    return {
      email: address.email.trim(),
      cart: items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        ...(i.variationId ? { variationId: i.variationId } : {}),
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
    };
  }

  async function completeAndRedirect(sid: string) {
    const res = await fetch("/api/checkout/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: sid }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data?.error ?? "Order creation failed. Contact support.");
      return;
    }
    router.push(`/order-complete?order=${data.orderId}&key=${data.orderKey}`);
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
      if (provider === "stripe") {
        const res = await fetch("/api/checkout/create-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildPayload()),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data?.error ?? "Couldn't start checkout. Please try again.");
          return;
        }
        setSessionId(data.sessionId);
        setClientSecret(data.clientSecret);
      } else {
        // Paystack: initialise on the server, then open the inline popup.
        const res = await fetch("/api/checkout/create-paystack-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildPayload()),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data?.error ?? "Couldn't start checkout. Please try again.");
          return;
        }
        // Use newTransaction so we can wire onSuccess/onCancel callbacks
        // instead of relying on a callback URL redirect.
        const { default: PaystackPop } = await import("@paystack/inline-js");
        const popup = new PaystackPop();
        popup.newTransaction({
          key: data.publicKey,
          email: address.email.trim(),
          amount: Math.round(data.amount * 100), // Paystack expects minor units
          currency,
          reference: data.reference,
          onSuccess: async () => {
            await completeAndRedirect(data.sessionId);
          },
          onCancel: () => {
            setError("Payment cancelled.");
            setSubmitting(false);
          },
        });
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      if (provider === "stripe") setSubmitting(false);
      // For Paystack we leave `submitting` true until the popup resolves —
      // onSuccess/onCancel handle the unblock.
    }
  }

  if (items.length === 0 && !clientSecret) {
    return (
      <section style={{ padding: "clamp(60px, 8vw, 120px) clamp(20px, 4vw, 60px)" }}>
        <div className="mx-auto" style={{ maxWidth: 720 }}>
          <h1 className="type-h1 uppercase" style={{ color: "var(--color-dark)" }}>
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
              fontSize: 16,
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
          <h1 className="type-h1 uppercase" style={{ color: "var(--color-dark)" }}>
            Checkout
          </h1>

          {!clientSecret ? (
            <AddressAndShipping
              address={address}
              setField={field}
              provider={provider}
              setProvider={setProvider}
              availableProviders={availableProviders}
              onSubmit={handleStartPayment}
              submitting={submitting}
              priceReady={allLinesPriced && !repricing}
              error={error}
              isAuthenticated={isAuthenticated}
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
          items={items.map((i) => {
            const sale = saleInfoFor(i.productId);
            return {
              id: i.id,
              name: i.name,
              quantity: i.quantity,
              price: unitPriceFor(i.productId),
              regularPrice: sale?.regular_price ?? null,
              image: i.image,
            };
          })}
          subtotal={subtotal}
          total={total}
          currency={currency}
          repricing={repricing}
        />
      </div>
    </section>
  );
}

interface AddressAndShippingProps {
  address: AddressState;
  setField: (key: keyof AddressState, value: string) => void;
  provider: Provider;
  setProvider: (p: Provider) => void;
  availableProviders: Provider[];
  onSubmit: () => void;
  submitting: boolean;
  priceReady: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

function AddressAndShipping({
  address,
  setField,
  provider,
  setProvider,
  availableProviders,
  onSubmit,
  submitting,
  priceReady,
  error,
  isAuthenticated,
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
      {!isAuthenticated && (
        <div
          className="font-barlow-condensed flex flex-wrap items-center justify-between"
          style={{
            gap: 8,
            padding: "12px 16px",
            background: "var(--color-light-bg)",
            border: "1px solid var(--color-border-light)",
            borderRadius: 4,
            fontSize: 16,
            color: "var(--color-dark)",
          }}
        >
          <span>You&apos;re checking out as a guest — no account needed.</span>
          <Link
            href="/login?redirect=/checkout"
            className="font-bold underline"
            style={{ color: "var(--color-dark)" }}
          >
            Have an account? Sign in
          </Link>
        </div>
      )}

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
        <SectionHeading>Delivery address</SectionHeading>
        <Field label="Address" value={address.address_1} onChange={(v) => setField("address_1", v)} required />
        <Field label="Apartment, suite, etc. (optional)" value={address.address_2} onChange={(v) => setField("address_2", v)} />
        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 14 }}>
          <Field label="City" value={address.city} onChange={(v) => setField("city", v)} required />
          <Field label="State / region" value={address.state} onChange={(v) => setField("state", v)} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 14 }}>
          <Field label="Postcode" value={address.postcode} onChange={(v) => setField("postcode", v)} />
          <CountryField value={address.country} onChange={(v) => setField("country", v)} />
        </div>
      </section>

      {availableProviders.length > 1 && (
        <section className="flex flex-col" style={{ gap: 10 }}>
          <SectionHeading>Payment method</SectionHeading>
          <div className="flex" style={{ gap: 8 }}>
            {availableProviders.map((p) => {
              const active = provider === p;
              const label = p === "paystack" ? "Paystack" : "Card (Stripe)";
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setProvider(p)}
                  className="font-barlow-condensed font-medium uppercase cursor-pointer"
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    border: `1px solid ${active ? "var(--color-dark)" : "var(--color-border-light)"}`,
                    background: active ? "#FFFBE6" : "white",
                    color: "var(--color-dark)",
                    fontSize: 15,
                    letterSpacing: "0.05em",
                    borderRadius: 4,
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {error && (
        <p
          className="font-barlow-condensed"
          style={{ fontSize: 16, color: "#B91C1C", padding: "10px 14px", background: "#FEE2E2", borderRadius: 4 }}
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || !priceReady}
        className="font-barlow-condensed font-bold uppercase cursor-pointer border-none"
        style={{
          padding: "16px 24px",
          background: submitting || !priceReady ? "#E5E7EB" : "#FFD600",
          color: "var(--color-dark)",
          fontSize: 16,
          letterSpacing: "0.05em",
          cursor: submitting || !priceReady ? "default" : "pointer",
        }}
      >
        {submitting
          ? provider === "paystack"
            ? "Opening Paystack…"
            : "Starting…"
          : !priceReady
            ? "Updating prices…"
            : provider === "paystack"
              ? "Pay with Paystack"
              : "Continue to payment"}
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
          style={{ fontSize: 16, color: "#B91C1C", padding: "10px 14px", background: "#FEE2E2", borderRadius: 4 }}
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
  items: {
    id: number;
    name: string;
    quantity: number;
    price: number | null;          // null while reprice is loading for this line
    regularPrice: number | null;
    image: string;
  }[];
  subtotal: number | null;          // null while any line is still unpriced
  total: number | null;
  currency: string;
  repricing?: boolean;
}

function CheckoutSummary({ items, subtotal, total, currency, repricing }: CheckoutSummaryProps) {
  return (
    <aside
      className="flex flex-col h-fit"
      style={{
        padding: "clamp(20px, 3vw, 28px)",
        border: "1px solid var(--color-border-light)",
        gap: 20,
        position: "sticky",
        top: 80,
        opacity: repricing ? 0.6 : 1,
        transition: "opacity 0.15s",
      }}
    >
      <div className="flex items-center justify-between">
        <h2
          className="font-barlow-condensed font-bold uppercase"
          style={{ fontSize: 16, color: "var(--color-text-muted)", letterSpacing: "0.05em" }}
        >
          Order Summary
        </h2>
        {repricing && (
          <span className="font-barlow-condensed" style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
            Updating prices…
          </span>
        )}
      </div>
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
              <span className="font-barlow-condensed font-bold" style={{ fontSize: 17, color: "var(--color-dark)" }}>
                {item.name}
              </span>
              <span className="font-barlow-condensed" style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                Qty {item.quantity}
              </span>
            </div>
            <div className="flex flex-col items-end">
              {item.price === null ? (
                <span
                  aria-hidden
                  className="font-barlow-condensed"
                  style={{
                    display: "inline-block",
                    width: 64,
                    height: 14,
                    background: "var(--color-border-light)",
                    borderRadius: 3,
                  }}
                />
              ) : (
                <>
                  {item.regularPrice !== null && item.regularPrice > item.price && (
                    <span
                      className="font-barlow-condensed"
                      style={{ fontSize: 12, color: "var(--color-text-muted)", textDecoration: "line-through" }}
                    >
                      {formatPrice(item.regularPrice * item.quantity, currency)}
                    </span>
                  )}
                  <span
                    className="font-barlow-condensed font-bold"
                    style={{
                      fontSize: 16,
                      color: item.regularPrice !== null && item.regularPrice > item.price ? "#B91C1C" : "var(--color-dark)",
                    }}
                  >
                    {formatPrice(item.price * item.quantity, currency)}
                  </span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <div style={{ height: 1, background: "var(--color-border-light)" }} />
      <div className="flex flex-col" style={{ gap: 8 }}>
        <SummaryRow
          label="Subtotal"
          value={subtotal === null ? "—" : formatPrice(subtotal, currency)}
        />
        <SummaryRow
          label="Total"
          value={total === null ? "—" : formatPrice(total, currency)}
          bold
        />
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
      style={{ fontSize: 16, color: "var(--color-text-muted)", letterSpacing: "0.05em" }}
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

function CountryField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const countries = supportedCountries();
  return (
    <div className="flex flex-col" style={{ gap: 6 }}>
      <label htmlFor="f-country" className="font-barlow-condensed" style={{ fontSize: 15, color: "var(--color-dark)" }}>
        Country
      </label>
      <select
        id="f-country"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="font-barlow-condensed cursor-pointer"
        style={{
          padding: "12px 14px",
          border: "1px solid var(--color-border-light)",
          borderRadius: 4,
          fontSize: 16,
          color: "var(--color-dark)",
          background: "white",
        }}
      >
        {countries.map((c) => (
          <option key={c.code} value={c.code}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function Field({ label, type = "text", value, onChange, required, maxLength }: FieldProps) {
  const id = `f-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className="flex flex-col" style={{ gap: 6 }}>
      <label htmlFor={id} className="font-barlow-condensed" style={{ fontSize: 15, color: "var(--color-dark)" }}>
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
          fontSize: 16,
          color: "var(--color-dark)",
        }}
      />
    </div>
  );
}
