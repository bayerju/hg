import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PaymentFrom } from "./payment/payment-form";

export default function AddLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Link href={"/"} className="absolute left-0 top-0 p-5">
        <ArrowLeft />
      </Link>

      <div className=" relative h-full">{children}</div>
    </div>
  );
}
