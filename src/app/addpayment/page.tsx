import { api } from "~/trpc/react";
import { PaymentFrom } from "./payment-form";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { X } from "lucide-react";

export default async function AddPayment() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {/* <h1>add payment</h1> */}
      <Link href={"/"} className="absolute right-0 top-0 p-5">
        <X />
      </Link>
      <PaymentFrom />
    </main>
  );
}