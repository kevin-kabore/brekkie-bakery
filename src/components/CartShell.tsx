"use client";

import type { ReactNode } from "react";
import type { Product } from "@/types";
import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/Navbar";
import { CartBar } from "@/components/CartBar";

interface CartShellProps {
  products: Product[];
  children: ReactNode;
}

/** Wraps the page in CartProvider so Navbar, CartBar, and all children share cart state. */
export function CartShell({ products, children }: CartShellProps) {
  return (
    <CartProvider products={products}>
      <Navbar />
      {children}
      <CartBar />
    </CartProvider>
  );
}
