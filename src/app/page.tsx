import { CirclePlus } from "lucide-react";
import Link from "next/link";
import { Input } from "~/components/ui/input";

import { api } from "~/trpc/server";

export default async function Home() {
  const payments = await api.spending.getAll();
  return (
    <main className="flex min-h-screen flex-col items-center ">
      <h1 className=" text-lg font-semibold">last payments</h1>
      <ul>
        {payments.map((payment) => (
          <li key={payment.id}>
            {payment.name} - {payment.price ? payment.price / 100 : "Error"}€
          </li>
        ))}
      </ul>
      <Link className=" absolute bottom-0 right-0 p-5 " href={"/addpayment"}>
        <CirclePlus size={48} />
      </Link>
    </main>
  );
}
