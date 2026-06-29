"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { createProductReview } from "@/lib/woocommerce";
import { rateLimit } from "@/lib/rate-limit";
import type { FormState } from "@/lib/auth-definitions";

const ReviewSchema = z.object({
  productId: z.coerce.number().int().positive(),
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(254),
  rating: z.coerce.number().int().min(1, "Pick a rating").max(5),
  review: z.string().trim().min(10, "Review must be at least 10 characters").max(2000),
  // Honeypot — bots fill it, real users don't
  website: z.string().max(0).optional(),
});

export async function submitProductReview(
  _state: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = ReviewSchema.safeParse({
    productId: formData.get("productId"),
    name: formData.get("name"),
    email: formData.get("email"),
    rating: formData.get("rating"),
    review: formData.get("review"),
    website: formData.get("website") ?? "",
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  // Rate limit: 3 review submissions per IP per 15 minutes
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = rateLimit(`review:${ip}`, 3, 15 * 60 * 1000);
  if (!rl.allowed) {
    const minutes = Math.ceil(rl.retryAfterMs / 60000);
    return { message: `Too many submissions. Try again in ${minutes} minute${minutes > 1 ? "s" : ""}.` };
  }

  // Silently accept honeypot trips (no error message — bot can't tell)
  if (parsed.data.website && parsed.data.website.length > 0) {
    return { success: true, message: "Thanks! Your review has been submitted." };
  }

  try {
    await createProductReview({
      product_id: parsed.data.productId,
      reviewer: parsed.data.name,
      reviewer_email: parsed.data.email,
      review: parsed.data.review,
      rating: parsed.data.rating,
    });
    return {
      success: true,
      message: "Thanks! Your review will appear after moderation.",
    };
  } catch {
    return { message: "Couldn't submit your review. Please try again later." };
  }
}
