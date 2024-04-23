import { api } from "~/trpc/react";
import { PaymentFrom } from "./payment-form";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";

export default async function AddPayment() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      {/* <h1>add payment</h1> */}

      <PaymentFrom />
    </div>
  );
}
