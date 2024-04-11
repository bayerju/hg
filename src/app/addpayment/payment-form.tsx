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
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { ComboboxMulti } from "./combobox_multi";

export function PaymentFrom() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [payedBy, setPayedBy] = useState<string[]>([]);
  const createPayment = api.spending.create.useMutation({
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
          // payedBy,
        });
      }}
    >
      <Input
        placeholder="Bezeichnung"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        placeholder="price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <Input placeholder="Wer hat bezahlt?" />
      <ComboboxMulti />
      {/* <Select>
        <SelectTrigger className=" relative w-32">
          <SelectValue placeholder="Wer hat bezahlt?" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Dirk">Dirk</SelectItem>
          <SelectItem value="Jezabel und Julian">Jezabel und Julian</SelectItem>
          <SelectItem value="Jezabel">Jezabel</SelectItem>
          <SelectItem value="Julian">Julian</SelectItem>
        </SelectContent>
      </Select> */}
      <Button type="submit">Hinzufügen</Button>
    </form>
  );
}
