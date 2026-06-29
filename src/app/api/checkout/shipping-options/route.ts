import { NextResponse } from "next/server";
import { getShippingOptionsForCountry } from "@/lib/shipping";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const country = url.searchParams.get("country");
  if (!country || country.length !== 2) {
    return NextResponse.json({ error: "country required (ISO-2)" }, { status: 400 });
  }
  const options = await getShippingOptionsForCountry(country);
  return NextResponse.json({ options });
}
