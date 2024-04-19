"use client";

import Link from "next/link";
import { cn } from "~/lib/utils";

export function Nav(props: { className?: string }) {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-2 justify-items-center",
        props.className,
      )}
    >
      <Link href="/">Home</Link>
      <Link href="/abrechnung">Abrechnung</Link>
    </div>
  );
}
