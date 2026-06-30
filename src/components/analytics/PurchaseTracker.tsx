"use client";

import { useEffect } from "react";
import { trackPurchase } from "@/lib/analytics";

interface PurchaseTrackerProps {
  transactionId: string;
  value: number;
  currency: string;
  tax?: number;
  shipping?: number;
  items: Array<{
    productId: number;
    name: string;
    price: number;
    quantity: number;
  }>;
}

export default function PurchaseTracker(props: PurchaseTrackerProps) {
  useEffect(() => {
    trackPurchase(props);
  }, [props]);

  return null;
}
