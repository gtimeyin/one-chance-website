"use client";

import { useEffect } from "react";
import { useCart } from "@/store/cart";

export default function ClearLocalCart() {
  useEffect(() => {
    useCart.getState().clearCart();
  }, []);
  return null;
}
