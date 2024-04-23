import { CirclePlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Input } from "~/components/ui/input";

import { api } from "~/trpc/server";
import { Payments } from "./_payments";

export default async function Home() {
  return (
    <main className="flex flex-col items-center ">
      <h1 className=" text-lg font-semibold">last payments</h1>
      <Payments />
      {/* <Link className=" absolute bottom-5 right-0 p-5 " href={"/addpayment"}>
        <CirclePlus size={48} />
      </Link> */}
    </main>
  );
}
