"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
} from "~/components/ui/select";
import { api } from "~/trpc/react";
import { PayedByOptions, PayedByOptionsType } from "~/server/db/schema";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export function PaymentFrom() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [payedBy, setPayedBy] = useState<PayedByOptionsType>("Dirk");
  const createPayment = api.payment.create.useMutation({
    onSuccess: () => {
      router.push("/");
    },
    onError: (error) => {
      alert(error.message);
    },
  });
  return (
    <form
      className="relative flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        createPayment.mutate({
          name,
          price: Math.round(Number(price.replace(",", "."))) * 100,
          payedBy,
        });
      }}
    >
      <Input
        placeholder="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        placeholder="price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <Select>
        <SelectTrigger className=" relative w-32">
          <SelectValue placeholder="Wer hat bezahlt?" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Dirk">Dirk</SelectItem>
          <SelectItem value="Jezabel und Julian">Jezabel und Julian</SelectItem>
          <SelectItem value="Jezabel">Jezabel</SelectItem>
          <SelectItem value="Julian">Julian</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit">Hinzufügen</Button>
    </form>
  );
}
