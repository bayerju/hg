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
import { SearchUsers, SimpleUser } from "../combobox_multi";

export function PaymentFrom() {
  const router = useRouter();
  const utils = api.useUtils();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [payedBy, setPayedBy] = useState<SimpleUser[]>([]);
  const [payedFor, setPayedFor] = useState<SimpleUser[]>([]);
  const createPayment = api.spending.create.useMutation({
    onSuccess: async () => {
      await utils.spending.getAll.invalidate();
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
          payedByIds: payedBy.map((user) => user.clerkId),
          payedForIds: payedFor.map((user) => user.clerkId),
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
      <SearchUsers
        placeholder={"Wer hat bezahlt"}
        selectedUsers={payedBy}
        setSelectedUsers={setPayedBy}
      />
      <SearchUsers
        placeholder={"Für wen wurde bezahlt"}
        selectedUsers={payedFor}
        setSelectedUsers={setPayedFor}
      />
      <Button type="submit">Hinzufügen</Button>
    </form>
  );
}
